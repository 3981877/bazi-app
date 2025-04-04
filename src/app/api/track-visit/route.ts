/**
 * 八字合婚 - 访问记录API
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

import { NextResponse } from 'next/server';
import { ensureDatabaseConnected } from '@/lib/db';
import Visit from '@/models/Visit';
import { headers } from 'next/headers';

// 从请求头中获取真实IP地址
const getClientIP = (request: Request): string => {
  const headersList = headers();
  
  // 按优先级尝试获取IP
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for可能包含多个IP，取第一个
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = headersList.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // 尝试从请求对象获取
  if (request.headers) {
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    if (cfConnectingIP) {
      return cfConnectingIP;
    }
  }
  
  // 无法获取真实IP
  return '0.0.0.0';
};

export async function POST(request: Request) {
  try {
    // 获取请求数据
    const {
      ip: clientProvidedIP,
      location,
      device,
      browser,
      os,
      userAgent,
      path,
      referrer
    } = await request.json();
    
    // 使用服务器端逻辑获取IP，如果客户端未能提供
    const ip = clientProvidedIP && clientProvidedIP !== '0.0.0.0' 
      ? clientProvidedIP 
      : getClientIP(request);
    
    // 连接到数据库
    await ensureDatabaseConnected();
    
    // 创建新的访问记录
    const visit = await Visit.create({
      ip,
      location: location || '未知',
      device: device || '未知',
      browser: browser || '未知',
      os: os || '未知',
      userAgent,
      path: path || '/',
      referrer,
      timestamp: new Date()
    });
    
    return NextResponse.json({ 
      success: true, 
      message: '访问记录已保存',
      visitId: visit._id
    });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json(
      { success: false, message: '保存访问记录失败' },
      { status: 500 }
    );
  }
} 