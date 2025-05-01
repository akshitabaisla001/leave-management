import mongoose, { Document } from 'mongoose';

export interface ILeave extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  leaveType: 'planned' | 'emergency' | 'short';
}

const leaveSchema = new mongoose.Schema<ILeave>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  reason: { type: String, required: true },
  leaveType: { type: String, enum: ['planned', 'emergency', 'short'], required: true },
}, {
  timestamps: true
});

const Leave = mongoose.model<ILeave>('Leave', leaveSchema);
export default Leave;
