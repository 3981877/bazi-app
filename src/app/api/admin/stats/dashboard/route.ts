/**
 * 八字合婚 - 仪表盘统计API
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

import { NextResponse } from 'next/server';
import { ensureDatabaseConnected } from '@/lib/db';
import Visit from '@/models/Visit';
import User from '@/models/User';
import Calculation from '@/models/Calculation';

interface DeviceCounts {
  [key: string]: number;
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
    
    // 获取总访问量（指定时间范围内）
    const totalVisits = await Visit.countDocuments({
      timestamp: { $gte: minDate }
    });
    
    // 获取独立IP访问量
    const uniqueIPs = await Visit.distinct('ip', {
      timestamp: { $gte: minDate }
    }).then(ips => ips.filter(ip => ip && ip !== '0.0.0.0' && ip !== 'unknown').length);
    
    // 获取设备统计
    const deviceStats = await Visit.aggregate([
      { $match: { timestamp: { $gte: minDate } } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).then(results => {
      const deviceCounts: DeviceCounts = {};
      results.forEach(item => {
        const key = item._id || '未知';
        deviceCounts[key] = item.count;
      });
      return deviceCounts;
    });
    
    // 获取注册用户数
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({
      createdAt: { $gte: minDate }
    });
    
    // 获取每日访问趋势（过去30天）
    const dailyVisits = await Visit.aggregate([
      { $match: { timestamp: { $gte: minDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 },
          uniqueIPs: { $addToSet: '$ip' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
    
    // 格式化日期并填补没有数据的日期
    const formattedDailyVisits = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      // 查找匹配的日期数据
      const matchingData = dailyVisits.find(
        item => item._id.year === year && item._id.month === month && item._id.day === day
      );
      
      formattedDailyVisits.push({
        date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        visits: matchingData ? matchingData.count : 0,
        uniqueCount: matchingData ? matchingData.uniqueIPs.filter((ip: string) => ip && ip !== '0.0.0.0' && ip !== 'unknown').length : 0
      });
    }
    
    // 获取合婚测算次数
    const calculationsMade = await Calculation.countDocuments();
    const newCalculations = await Calculation.countDocuments({
      createdAt: { $gte: minDate }
    });
    
    // 获取热门页面
    const popularPages = await Visit.aggregate([
      { $match: { timestamp: { $gte: minDate }, path: { $ne: null } } },
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).then(results => {
      return results.map(item => ({
        path: item._id,
        views: item.count,
        percentage: totalVisits ? parseFloat(((item.count / totalVisits) * 100).toFixed(1)) : 0
      }));
    });
    
    // 获取来源统计
    const referrerStats = await Visit.aggregate([
      { 
        $match: { 
          timestamp: { $gte: minDate }, 
          referrer: { $nin: [null, ''] } 
        } 
      },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).then(results => {
      return results.map(item => ({
        referrer: item._id,
        count: item.count,
        percentage: totalVisits ? parseFloat(((item.count / totalVisits) * 100).toFixed(1)) : 0
      }));
    });

    return NextResponse.json({
      success: true,
      data: {
        visits: {
          total: totalVisits,
          uniqueIPs,
          dailyTrend: formattedDailyVisits
        },
        devices: deviceStats,
        users: {
          total: totalUsers,
          new: newUsers
        },
        calculations: {
          total: calculationsMade,
          new: newCalculations
        },
        popularPages,
        referrerStats,
        timePeriod: `过去${days}天`
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return NextResponse.json(
      { success: false, message: '获取仪表盘统计数据失败' },
      { status: 500 }
    );
  }
} 