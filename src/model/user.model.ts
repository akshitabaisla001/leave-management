
import mongoose, { Document, Types } from 'mongoose';


export interface IUser extends Document {
  _id: Types.ObjectId;  
  name: string;
  email: string;
  password: string;
  otp?: string;
  otpExpiresAt?: Date;
  profilePicture?: string;
  leavesRemaining: number;
  leaveHistory: mongoose.Schema.Types.ObjectId[];
}


const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: String,
  otpExpiresAt: Date,
  profilePicture: String,
  leavesRemaining: { type: Number, default: 6 },
  leaveHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Leave' }]
});

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;

