/**
 * 八字合婚 - IP统计API
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

import { NextResponse } from 'next/server';
import { ensureDatabaseConnected } from '@/lib/db';
import Visit from '@/models/Visit';

interface IPData {
  ip: string;
  location: string;
  visits: number;
  lastVisit: string;
  device: string;
  browsers: string[];
  operatingSystems: string[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // 参数处理：时间范围、过滤条件等
    const days = parseInt(searchParams.get('days') || '30');
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - days);
    
    // 确保数据库连接
    await ensureDatabaseConnected();
    
    // 使用高级聚合查询获取IP统计数据
    const ipStats = await Visit.aggregate([
      // 时间范围过滤
      {
        $match: {
          timestamp: { $gte: minDate }
        }
      },
      // 按IP分组
      {
        $group: {
          _id: '$ip',
          location: { $first: '$location' },
          visits: { $sum: 1 },
          lastVisit: { $max: '$timestamp' },
          devices: { $addToSet: '$device' },
          browsers: { $addToSet: '$browser' },
          operatingSystems: { $addToSet: '$os' }
        }
      },
      // 按访问次数排序
      {
        $sort: { visits: -1 }
      },
      // 限制结果数量，避免返回过多数据
      {
        $limit: 500
      }
    ]);
    
    // 格式化IP数据，增加更多设备信息
    const ipData: IPData[] = ipStats.map(item => {
      // 确定主要使用的设备类型（移动还是桌面）
      const deviceCounts: Record<string, number> = {};
      item.devices.forEach((device: string) => {
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });
      
      const primaryDevice = Object.entries(deviceCounts)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0])[0] || '未知';
      
      return {
        ip: item._id,
        location: item.location || '未知',
        visits: item.visits,
        lastVisit: new Date(item.lastVisit).toLocaleDateString('zh-CN'), // 格式化为本地日期格式
        device: primaryDevice,
        browsers: item.browsers || [],
        operatingSystems: item.operatingSystems || []
      };
    });
    
    // 生成地区统计
    const locationStats: Record<string, number> = {};
    ipData.forEach(item => {
      if (item.location && item.location !== '未知') {
        // 提取主要地区（通常是国家或省份），简化统计
        const mainLocation = item.location.split(' ')[0];
        locationStats[mainLocation] = (locationStats[mainLocation] || 0) + item.visits;
      } else {
        locationStats['未知'] = (locationStats['未知'] || 0) + item.visits;
      }
    });
    
    // 按访问量排序的地区数据
    const sortedLocationStats = Object.entries(locationStats)
      .sort((a, b) => b[1] - a[1])
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {} as Record<string, number>);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        ipStats: ipData,
        locationStats: sortedLocationStats,
        totalUniqueIPs: ipData.length,
        timePeriod: `过去${days}天`
      }
    });
  } catch (error) {
    console.error('Error fetching IP statistics:', error);
    return NextResponse.json(
      { success: false, message: '获取IP统计数据失败' },
      { status: 500 }
    );
  }
} 