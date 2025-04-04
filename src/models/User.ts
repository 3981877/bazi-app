import mongoose, { Document, Schema } from 'mongoose';

// 用户文档接口
export interface IUser extends Document {
  username: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

// 用户Schema
const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 密码比较方法
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  // 实际应用中应使用加密后的密码比较
  // 这里为简化直接比较明文密码
  return this.password === password;
};

// 添加或获取模型
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 