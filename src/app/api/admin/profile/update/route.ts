import { NextResponse } from 'next/server';
import { ensureDatabaseConnected } from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await ensureDatabaseConnected();
    const { userId, currentPassword, newPassword, username } = await request.json();
    
    // 确保至少提供了用户ID和一个要更新的字段
    if (!userId || (!newPassword && !username)) {
      return NextResponse.json(
        { success: false, message: '请提供有效的更新数据' },
        { status: 400 }
      );
    }
    
    // 查找用户
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 如果要更新密码，需要验证当前密码
    if (newPassword) {
      // 验证当前密码
      const isPasswordValid = await user.comparePassword(currentPassword);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: '当前密码不正确' },
          { status: 401 }
        );
      }
      
      // 更新密码
      user.password = newPassword;
    }
    
    // 如果要更新用户名，需要确保唯一性
    if (username && username !== user.username) {
      // 检查用户名是否已存在
      const existingUser = await User.findOne({ username });
      
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: '用户名已存在' },
          { status: 409 }
        );
      }
      
      // 更新用户名
      user.username = username;
    }
    
    // 保存更新
    await user.save();
    
    return NextResponse.json({ 
      success: true, 
      message: '用户信息更新成功',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    return NextResponse.json(
      { success: false, message: '更新失败，请稍后再试' },
      { status: 500 }
    );
  }
} 