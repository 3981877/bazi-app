import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Ad } from '@/models/Ad';

export async function GET() {
  try {
    await connectToDatabase();
    
    // 获取启用的第一个广告
    const ad = await Ad.findOne({ enabled: true }).sort({ updatedAt: -1 });
    
    if (!ad) {
      return NextResponse.json({ success: true, adCode: null });
    }
    
    return NextResponse.json({ 
      success: true, 
      adCode: ad.adCode,
      position: ad.position
    });
  } catch (error) {
    console.error('Error getting ad:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get ad' },
      { status: 500 }
    );
  }
} 