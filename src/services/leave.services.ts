
import Leave from '../model/leave.model';
import User from '../model/user.model';
import moment from 'moment';

export const applyForLeave = async (
  userId: string,
  startDate: Date,
  endDate: Date,
  reason: string,
  leaveType: 'planned' | 'emergency' | 'short'
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const threeDaysAgo = moment().subtract(3, 'days').startOf('day');
  if (moment(startDate).isBefore(threeDaysAgo)) {
    throw new Error('Cannot apply for leave backdated by more than 3 days');
  }

  const existingLeave = await Leave.findOne({
    userId,
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      },
    ],
  });

  if (existingLeave) {
    throw new Error('You have already applied for leave during this period');
  }

  const duration = moment(endDate).diff(moment(startDate), 'days') + 1;

  // Short leave constraint: must be 1-day duration
  if (leaveType === 'short' && duration !== 1) {
    throw new Error('Short leave can only be taken for 1 day');
  }

  const leaveBalanceKey =
    leaveType === 'planned' ? 'plannedLeavesRemaining' :
    leaveType === 'emergency' ? 'emergencyLeavesRemaining' :
    'shortLeavesRemaining';

  const currentBalance = user[leaveBalanceKey];
  if (currentBalance < duration) {
    throw new Error(`Insufficient ${leaveType} leave balance. Required: ${duration}, Available: ${currentBalance}`);
  }

  const leave = await Leave.create({
    userId,
    startDate,
    endDate,
    reason,
    leaveType,
    status: 'pending',
  });

  user[leaveBalanceKey] -= duration;
  await user.save();

  return {
    leave,
    balance: {
      planned: user.plannedLeavesRemaining,
      emergency: user.emergencyLeavesRemaining,
      short: user.shortLeavesRemaining,
    }
  };
};

// Rollback service
export const rollbackLeave = async (leaveId: string, userId: string) => {
  const leave = await Leave.findOne({ _id: leaveId, userId });
  if (!leave) throw new Error('Leave not found for rollback');

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const duration = moment(leave.endDate).diff(moment(leave.startDate), 'days') + 1;

  const leaveBalanceKey =
    leave.leaveType === 'planned' ? 'plannedLeavesRemaining' :
    leave.leaveType === 'emergency' ? 'emergencyLeavesRemaining' :
    'shortLeavesRemaining';

  user[leaveBalanceKey] += duration;

  await user.save();
  await Leave.findByIdAndDelete(leaveId);

  return {
    message: 'Leave rolled back successfully',
    balance: {
      planned: user.plannedLeavesRemaining,
      emergency: user.emergencyLeavesRemaining,
      short: user.shortLeavesRemaining,
    }
  };
};
