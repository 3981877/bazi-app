/**
 * 八字合婚 - 健康检查API
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

import { NextResponse } from 'next/server';
import { getDatabaseStatus } from '@/lib/db';

export async function GET() {
  try {
    // 获取数据库连接状态
    const dbStatus = getDatabaseStatus();
    
    // 系统启动时间
    const uptime = process.uptime();
    
    // 内存使用情况
    const memoryUsage = process.memoryUsage();
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
      database: {
        connected: dbStatus.isConnected,
        lastConnect: dbStatus.lastConnectTime,
        connectionAttempts: dbStatus.connectionAttempts
      },
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
      },
      environment: process.env.NODE_ENV
    }, { status: 200 });
  } catch (error) {
    console.error('健康检查API错误:', error);
    
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 