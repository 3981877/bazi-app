import { NextResponse } from 'next/server';
import { ensureDatabaseConnected } from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await ensureDatabaseConnected();
    const { username, password } = await request.json();
    
    // 从数据库中查找用户
    const user = await User.findOne({ username });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      );
    }
    
    // 比较密码
    const isPasswordValid = await user.comparePassword(password);
    
    if (isPasswordValid) {
      return NextResponse.json({ 
        success: true, 
        message: '登录成功',
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          role: user.role,
        }
      });
    } else {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { success: false, message: '登录失败，请稍后再试' },
      { status: 500 }
    );
  }
} 