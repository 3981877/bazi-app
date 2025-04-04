import { NextResponse } from 'next/server';
import { ensureDatabaseConnected, getDatabaseStatus } from '@/lib/db';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // 连接数据库检查状态
    const isConnected = await ensureDatabaseConnected();
    const dbStatus = getDatabaseStatus();
    
    // 尝试读取package.json以获取版本号
    let version = 'v1.0.0'; // 默认版本
    const packagePath = path.join(process.cwd(), 'package.json');
    
    if (fs.existsSync(packagePath)) {
      try {
        const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        if (packageData.version) {
          version = 'v' + packageData.version;
        }
      } catch (error) {
        console.error('读取package.json失败:', error);
      }
    }
    
    // 获取上次更新时间 (使用构建时间或服务器启动时间)
    const startTime = process.env.SERVER_START_TIME || new Date().toISOString();
    
    // 构建系统信息
    const systemInfo = {
      version,
      updateDate: dbStatus.lastConnectTime ? new Date(dbStatus.lastConnectTime).toISOString() : startTime,
      serverStartTime: process.env.SERVER_START_TIME || new Date().toISOString(),
      serverStatus: 'running', // 服务器正在运行
      databaseStatus: isConnected ? 'connected' : 'disconnected',
      databaseName: mongoose.connection.name || 'unknown',
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development'
    };
    
    return NextResponse.json({
      success: true,
      data: systemInfo
    });
  } catch (error) {
    console.error('获取系统信息失败:', error);
    return NextResponse.json(
      { success: false, message: '获取系统信息失败' },
      { status: 500 }
    );
  }
} 