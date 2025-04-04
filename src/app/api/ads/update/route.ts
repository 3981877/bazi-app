import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Ad } from '@/models/Ad';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const data = await request.json();
    const { adCode, enabled, position } = data;
    
    // 查找现有广告或创建新的
    let ad = await Ad.findOne({});
    
    if (!ad) {
      ad = new Ad({
        adCode: adCode || '',
        enabled: enabled !== undefined ? enabled : false,
        position: position || 'bottom-right'
      });
    } else {
      ad.adCode = adCode || ad.adCode;
      ad.enabled = enabled !== undefined ? enabled : ad.enabled;
      ad.position = position || ad.position;
    }
    
    await ad.save();
    
    return NextResponse.json({ 
      success: true, 
      message: '广告设置已保存'
    });
  } catch (error) {
    console.error('Error updating ad:', error);
    return NextResponse.json(
      { success: false, error: '保存广告设置失败' },
      { status: 500 }
    );
  }
} 