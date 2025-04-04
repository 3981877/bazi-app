import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Calculation from '@/models/Calculation';
import { calculateBazi, calculateCompatibility } from '@/lib/bazi';

export async function POST(request: Request) {
  try {
    const {
      maleName,
      maleYear,
      maleMonth,
      maleDay,
      maleTime,
      maleLeapMonth,
      femaleName,
      femaleYear,
      femaleMonth,
      femaleDay,
      femaleTime,
      femaleLeapMonth,
      ipAddress,
      userAgent
    } = await request.json();

    await connectToDatabase();
    
    // 计算八字
    const maleBazi = calculateBazi(
      parseInt(maleYear),
      parseInt(maleMonth),
      parseInt(maleDay),
      maleTime,
      maleLeapMonth === 'true'
    );
    
    const femaleBazi = calculateBazi(
      parseInt(femaleYear),
      parseInt(femaleMonth),
      parseInt(femaleDay),
      femaleTime,
      femaleLeapMonth === 'true'
    );
    
    // 计算合婚结果
    const result = calculateCompatibility(maleBazi, femaleBazi);
    
    // 保存计算记录
    const calculation = await Calculation.create({
      maleName,
      maleBirthday: {
        year: parseInt(maleYear),
        month: parseInt(maleMonth),
        day: parseInt(maleDay),
        time: maleTime,
        isLeapMonth: maleLeapMonth === 'true'
      },
      maleBazi,
      femaleName,
      femaleBirthday: {
        year: parseInt(femaleYear),
        month: parseInt(femaleMonth),
        day: parseInt(femaleDay),
        time: femaleTime,
        isLeapMonth: femaleLeapMonth === 'true'
      },
      femaleBazi,
      result,
      ipAddress,
      userAgent
    });
    
    return NextResponse.json({
      success: true,
      message: '合婚计算结果已保存',
      calculationId: calculation._id,
      maleBazi,
      femaleBazi,
      result
    });
  } catch (error) {
    console.error('Error saving calculation:', error);
    return NextResponse.json(
      { success: false, message: '保存合婚计算结果失败' },
      { status: 500 }
    );
  }
} 