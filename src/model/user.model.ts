

import mongoose, { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  otp?: string;
  otpExpiresAt?: Date;
  profilePicture?: string;
  plannedLeavesRemaining: number;
  emergencyLeavesRemaining: number;
  shortLeavesRemaining: number;
  leaveHistory: mongoose.Schema.Types.ObjectId[];  // Array of references to leave documents
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: String,
  otpExpiresAt: Date,
  profilePicture: String,
  plannedLeavesRemaining: { type: Number, default: 2 },  // Default planned leaves
  emergencyLeavesRemaining: { type: Number, default: 2}, // Default emergency leaves
  shortLeavesRemaining: { type: Number, default:2 },     // Default short leaves
  leaveHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Leave' }]  // Reference to Leave documents
});

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;

