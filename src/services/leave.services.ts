import Leave from '../model/leave.model'; 
import User from '../model/user.model'; 
import moment from 'moment'; 


export const applyForLeave = async (userId: string, startDate: Date, endDate: Date, reason: string, leaveType: 'planned' | 'emergency') => {

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');


  const threeDaysAgo = moment().subtract(3, 'days').toDate();
  if (new Date(startDate) < threeDaysAgo) {
    throw new Error('Cannot apply for leave backdated by more than 3 days');
  }

 
  const existingLeave = await Leave.findOne({
    userId,
    $or: [
      { startDate: { $eq: startDate } },
      { endDate: { $eq: endDate } }
    ],
  });
  if (existingLeave) {
    throw new Error('You have already applied for leave on this day');
  }


  if (user.leavesRemaining <= 0) {
    throw new Error('Insufficient leave balance');
  }


  const leave = await Leave.create({
    userId,
    startDate,
    endDate,
    reason,
    leaveType,
    status: 'pending',
  });

 
  user.leavesRemaining -= 1;
  await user.save();

  return leave;
};
