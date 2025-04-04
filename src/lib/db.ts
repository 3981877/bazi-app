/**
 * 八字合婚 - 数据库连接管理
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

import mongoose from 'mongoose';

// MongoDB连接字符串
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bazi';

// 数据库连接状态
interface DbConnectionState {
  isConnected: boolean;
  connectionAttempts: number;
  lastConnectTime: Date | null;
  lastErrorMessage: string | null;
}

// 连接状态初始值
const state: DbConnectionState = {
  isConnected: false,
  connectionAttempts: 0,
  lastConnectTime: null,
  lastErrorMessage: null,
};

// 最大重试次数和重试间隔
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 3000; // 3秒

/**
 * 连接到数据库
 * @param retry 是否在失败时自动重试
 * @returns 连接状态
 */
export const connectToDatabase = async (retry = true): Promise<DbConnectionState> => {
  // 如果已经连接，直接返回
  if (state.isConnected) {
    return state;
  }

  try {
    // 增加连接尝试次数
    state.connectionAttempts += 1;
    
    // 配置Mongoose
    mongoose.set('strictQuery', true);
    
    // 连接数据库
    await mongoose.connect(MONGODB_URI);
    
    // 更新状态
    state.isConnected = true;
    state.lastConnectTime = new Date();
    state.lastErrorMessage = null;
    
    console.log(`MongoDB已连接到 ${MONGODB_URI}`);
    return state;
  } catch (error) {
    // 更新错误状态
    state.isConnected = false;
    state.lastErrorMessage = error instanceof Error ? error.message : String(error);
    
    console.error(`MongoDB连接失败 (尝试 ${state.connectionAttempts}/${MAX_RETRIES}):`, error);
    
    // 自动重试逻辑
    if (retry && state.connectionAttempts < MAX_RETRIES) {
      console.log(`将在 ${RETRY_INTERVAL/1000} 秒后重试...`);
      
      return new Promise((resolve) => {
        setTimeout(async () => {
          const retryState = await connectToDatabase(true);
          resolve(retryState);
        }, RETRY_INTERVAL);
      });
    }
    
    return state;
  }
};

/**
 * 从数据库断开连接
 */
export const disconnectFromDatabase = async (): Promise<void> => {
  if (state.isConnected) {
    try {
      await mongoose.disconnect();
      state.isConnected = false;
      state.lastConnectTime = null;
      console.log('MongoDB已断开连接');
    } catch (error) {
      console.error('MongoDB断开连接失败:', error);
    }
  }
};

/**
 * 获取当前数据库连接状态
 */
export const getDatabaseStatus = (): DbConnectionState => {
  return { ...state };
};

/**
 * 确保数据库已连接，如果未连接则尝试连接
 * 用于API路由和需要数据库连接的场景
 */
export const ensureDatabaseConnected = async (): Promise<boolean> => {
  if (!state.isConnected) {
    await connectToDatabase();
  }
  return state.isConnected;
}; 