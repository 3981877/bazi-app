/**
 * 八字合婚 - 应用初始化
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

import { setupDatabase } from './dbInit';

let isInitialized = false;

/**
 * 应用初始化函数，可在服务器启动时调用
 */
export const initializeApp = async (): Promise<boolean> => {
  if (isInitialized) {
    console.log('应用已初始化，跳过');
    return true;
  }

  console.log('开始初始化应用...');

  try {
    // 初始化数据库连接和结构
    const dbInitialized = await setupDatabase();
    
    if (!dbInitialized) {
      console.error('应用初始化失败: 数据库设置出错');
      return false;
    }
    
    // 任何其他初始化逻辑...
    
    isInitialized = true;
    console.log('应用初始化成功 ✓');
    return true;
  } catch (error) {
    console.error('应用初始化出错:', error);
    return false;
  }
};

// 自动初始化应用
// 仅在服务器端执行
if (typeof window === 'undefined') {
  initializeApp().catch(err => {
    console.error('自动应用初始化失败:', err);
  });
} 