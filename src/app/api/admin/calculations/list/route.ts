import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Calculation from '@/models/Calculation';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    await connectToDatabase();
    
    // 获取总记录数
    const total = await Calculation.countDocuments();
    
    // 获取分页数据
    const calculations = await Calculation.find({})
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .select({
        maleName: 1,
        femaleName: 1,
        maleBazi: 1,
        femaleBazi: 1,
        'result.totalScore': 1,
        timestamp: 1,
        ipAddress: 1
      });
    
    return NextResponse.json({
      success: true,
      data: {
        calculations,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching calculations:', error);
    return NextResponse.json(
      { success: false, message: '获取合婚计算记录失败' },
      { status: 500 }
    );
  }
} 