/**
 * 八字合婚 - 设备统计API
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

import { NextResponse } from 'next/server';
import { ensureDatabaseConnected } from '@/lib/db';
import Visit from '@/models/Visit';

interface DeviceStats {
  type: string;
  count: number;
  percentage: number;
}

interface BrowserStats {
  name: string;
  count: number;
  percentage: number;
  versions?: Record<string, number>; // 浏览器版本统计 (可选)
}

interface OSStats {
  name: string;
  count: number;
  percentage: number;
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
    
    // 获取指定时间范围内的访问总量
    const totalVisits = await Visit.countDocuments({
      timestamp: { $gte: minDate }
    });
    
    // 获取设备类型统计
    const deviceCounts = await Visit.aggregate([
      { $match: { timestamp: { $gte: minDate } } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const deviceStats: DeviceStats[] = deviceCounts.map(item => {
      const deviceType = item._id || '未知';
      const count = item.count;
      return {
        type: deviceType,
        count,
        percentage: totalVisits ? parseFloat(((count / totalVisits) * 100).toFixed(1)) : 0
      };
    });
    
    // 获取浏览器统计 - 增加详细统计
    const browserCounts = await Visit.aggregate([
      { $match: { timestamp: { $gte: minDate } } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 } // 限制返回前10个浏览器
    ]);
    
    const browserStats: BrowserStats[] = browserCounts.map(item => {
      const browserName = item._id || '未知';
      const count = item.count;
      return {
        name: browserName,
        count,
        percentage: totalVisits ? parseFloat(((count / totalVisits) * 100).toFixed(1)) : 0
      };
    });
    
    // 获取操作系统统计
    const osCounts = await Visit.aggregate([
      { $match: { timestamp: { $gte: minDate } } },
      { $group: { _id: '$os', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 } // 限制返回前10个操作系统
    ]);
    
    const osStats: OSStats[] = osCounts.map(item => {
      const osName = item._id || '未知';
      const count = item.count;
      return {
        name: osName,
        count,
        percentage: totalVisits ? parseFloat(((count / totalVisits) * 100).toFixed(1)) : 0
      };
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
          mobileCount: {
            $sum: { $cond: [{ $eq: ['$device', '移动'] }, 1, 0] }
          },
          desktopCount: {
            $sum: { $cond: [{ $eq: ['$device', '桌面'] }, 1, 0] }
          }
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
        total: matchingData ? matchingData.count : 0,
        mobile: matchingData ? matchingData.mobileCount : 0,
        desktop: matchingData ? matchingData.desktopCount : 0
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        deviceStats,
        browserStats,
        osStats,
        dailyVisits: formattedDailyVisits,
        totalVisits,
        timePeriod: `过去${days}天`
      }
    });
  } catch (error) {
    console.error('Error fetching device statistics:', error);
    return NextResponse.json(
      { success: false, message: '获取设备统计数据失败' },
      { status: 500 }
    );
  }
} 