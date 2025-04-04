import mongoose, { Document, Schema } from 'mongoose';

// 访问记录接口
export interface IVisit extends Document {
  ip: string;
  location: string;
  device: string;  // 'mobile' | 'desktop'
  browser: string;
  os: string;
  userAgent: string;
  path: string;
  referrer: string | null;
  timestamp: Date;
}

// 访问记录Schema
const VisitSchema = new Schema<IVisit>({
  ip: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: '未知',
  },
  device: {
    type: String,
    enum: ['移动', '桌面', '未知'],
    default: '未知',
  },
  browser: {
    type: String,
    default: '未知',
  },
  os: {
    type: String,
    default: '未知',
  },
  userAgent: {
    type: String,
    default: '',
  },
  path: {
    type: String,
    default: '/',
  },
  referrer: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// 添加索引优化查询
VisitSchema.index({ ip: 1 });
VisitSchema.index({ timestamp: -1 });
VisitSchema.index({ location: 1 });
VisitSchema.index({ device: 1 });
VisitSchema.index({ browser: 1 });
VisitSchema.index({ os: 1 });

// 添加或获取模型
export default mongoose.models.Visit || mongoose.model<IVisit>('Visit', VisitSchema); 