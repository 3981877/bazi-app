import mongoose, { Schema } from 'mongoose';

interface IAd {
  adCode: string;
  enabled: boolean;
  position: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdSchema = new Schema<IAd>(
  {
    adCode: {
      type: String,
      required: true,
      default: '',
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      enum: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
      default: 'bottom-right',
    },
  },
  { timestamps: true }
);

// 如果已经定义了Ad模型，使用已有的，否则创建新的
export const Ad = mongoose.models.Ad || mongoose.model<IAd>('Ad', AdSchema); 