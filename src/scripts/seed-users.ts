import mongoose from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from '../lib/db';
import User from '../models/User';

// 初始化管理员用户数据
const seedUsers = async () => {
  try {
    // 连接数据库
    await connectToDatabase();
    
    // 清空现有用户数据
    await User.deleteMany({});
    
    // 创建管理员用户
    await User.create({
      username: 'admin',
      password: 'admin123', // 实际应用中应加密存储
      name: '系统管理员',
      role: 'admin',
    });
    
    console.log('用户数据初始化成功！');
    
    // 断开数据库连接
    await disconnectFromDatabase();
    
  } catch (error) {
    console.error('用户数据初始化失败:', error);
    process.exit(1);
  }
};

// 执行初始化
seedUsers(); 