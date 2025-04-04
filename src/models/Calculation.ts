import mongoose, { Document, Schema } from 'mongoose';
import { CompatibilityScore } from '@/lib/bazi';

// 合婚计算记录接口
export interface ICalculation extends Document {
  maleName: string;
  maleBirthday: {
    year: number;
    month: number;
    day: number;
    time: string;
    isLeapMonth: boolean;
  };
  maleBazi: string[];
  femaleName: string;
  femaleBirthday: {
    year: number;
    month: number;
    day: number;
    time: string;
    isLeapMonth: boolean;
  };
  femaleBazi: string[];
  result: CompatibilityScore;
  timestamp: Date;
  ipAddress: string | null;
  userAgent: string | null;
}

// 合婚计算记录Schema
const CalculationSchema = new Schema<ICalculation>({
  maleName: {
    type: String,
    required: true,
  },
  maleBirthday: {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true },
    time: { type: String, required: true },
    isLeapMonth: { type: Boolean, default: false },
  },
  maleBazi: [{
    type: String,
    required: true,
  }],
  femaleName: {
    type: String,
    required: true,
  },
  femaleBirthday: {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true },
    time: { type: String, required: true },
    isLeapMonth: { type: Boolean, default: false },
  },
  femaleBazi: [{
    type: String,
    required: true,
  }],
  result: {
    totalScore: { type: Number, required: true },
    dayMasterHarmony: { type: Number, required: true },
    fiveElementsBalance: { type: Number, required: true },
    specialCombinations: { type: Number, required: true },
    clashesAvoidance: { type: Number, required: true },
    details: {
      dayMasterDetails: { type: String, required: true },
      fiveElementsDetails: { type: String, required: true },
      specialCombinationsDetails: { type: String, required: true },
      clashesDetails: { type: String, required: true },
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
    default: null,
  },
  userAgent: {
    type: String,
    default: null,
  },
});

// 添加索引优化查询
CalculationSchema.index({ timestamp: -1 });
CalculationSchema.index({ 'result.totalScore': -1 });
CalculationSchema.index({ ipAddress: 1 });

// 添加或获取模型
export default mongoose.models.Calculation || mongoose.model<ICalculation>('Calculation', CalculationSchema); 