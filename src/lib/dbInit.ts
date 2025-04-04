/**
 * 八字合婚 - 数据库初始化和种子数据
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

import { connectToDatabase, getDatabaseStatus } from './db';
import mongoose from 'mongoose';
import User from '@/models/User';
import Visit from '@/models/Visit';
import Calculation from '@/models/Calculation';
import { Ad } from '@/models/Ad';

/**
 * 初始化数据库，确保所有必要的集合和索引都创建好
 */
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    // 连接到数据库
    const connectionState = await connectToDatabase();
    
    if (!connectionState.isConnected) {
      console.error('数据库初始化失败: 无法连接到数据库');
      return false;
    }
    
    console.log('开始数据库初始化...');
    
    // 确保所有模型都已注册
    const modelNames = mongoose.modelNames();
    console.log('已注册的模型:', modelNames);
    
    // 检查必要的集合是否存在
    const requiredCollections = ['users', 'visits', 'calculations', 'ads'];
    
    // 获取数据库连接
    const connection = mongoose.connection;
    if (!connection || !connection.db) {
      console.error('无法获取数据库连接');
      return false;
    }
    
    const db = connection.db;
    const existingCollections = await db.listCollections().toArray();
    const existingCollectionNames = existingCollections.map(col => col.name);
    
    console.log('现有集合:', existingCollectionNames);
    
    // 创建必要但不存在的集合
    for (const collection of requiredCollections) {
      if (!existingCollectionNames.includes(collection)) {
        console.log(`创建集合: ${collection}`);
        await db.createCollection(collection);
      }
    }
    
    console.log('数据库初始化完成');
    return true;
  } catch (error) {
    console.error('数据库初始化出错:', error);
    return false;
  }
};

/**
 * 检查是否需要添加种子数据
 */
export const seedDatabase = async (): Promise<boolean> => {
  try {
    // 连接到数据库
    const connectionState = await connectToDatabase();
    
    if (!connectionState.isConnected) {
      console.error('添加种子数据失败: 无法连接到数据库');
      return false;
    }
    
    console.log('检查是否需要添加种子数据...');
    
    // 检查是否已有管理员用户
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    if (adminCount === 0) {
      console.log('创建默认管理员用户...');
      
      // 创建默认管理员
      const adminUser = new User({
        username: 'admin',
        password: 'admin123', // 在模型中会自动哈希处理
        name: '管理员',
        role: 'admin',
        isActive: true
      });
      
      await adminUser.save();
      console.log('默认管理员用户已创建');
    } else {
      console.log('已存在管理员用户，跳过');
    }
    
    // 创建默认广告位
    const adsCount = await Ad.countDocuments();
    
    if (adsCount === 0) {
      console.log('创建默认广告位...');
      
      const defaultAd = new Ad({
        name: '默认广告',
        position: 'bottom-right',
        adCode: '<div style="width:300px;height:250px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;border-radius:4px;color:#666;">广告位</div>',
        enabled: false,
      });
      
      await defaultAd.save();
      console.log('默认广告位已创建');
    } else {
      console.log('已存在广告位配置，跳过');
    }
    
    console.log('种子数据处理完成');
    return true;
  } catch (error) {
    console.error('添加种子数据出错:', error);
    return false;
  }
};

/**
 * 完整的数据库启动流程
 * 包括连接、初始化和添加种子数据
 */
export const setupDatabase = async (): Promise<boolean> => {
  try {
    console.log('开始数据库启动流程...');
    
    // 步骤1: 连接到数据库
    const connectionState = await connectToDatabase();
    
    if (!connectionState.isConnected) {
      console.error('数据库启动失败: 无法连接到数据库');
      return false;
    }
    
    // 步骤2: 初始化数据库结构
    const isInitialized = await initializeDatabase();
    
    if (!isInitialized) {
      console.error('数据库启动失败: 初始化失败');
      return false;
    }
    
    // 步骤3: 添加种子数据
    const isSeeded = await seedDatabase();
    
    if (!isSeeded) {
      console.warn('警告: 种子数据处理失败，但数据库仍可使用');
    }
    
    console.log('数据库启动流程完成✓');
    return true;
  } catch (error) {
    console.error('数据库启动流程出错:', error);
    return false;
  }
}; 