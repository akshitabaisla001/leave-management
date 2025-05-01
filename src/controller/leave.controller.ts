

import { Request, Response } from 'express';
import moment from 'moment';
import { applyForLeave, rollbackLeave } from '../services/leave.services';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const applyForLeaveController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { startDate, endDate, reason, leaveType } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: User ID missing' });
    return;
  }

  try {
    const start = moment(startDate, 'YYYY-MM-DD').toDate();
    const end = moment(endDate, 'YYYY-MM-DD').toDate();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ message: 'Invalid date format' });
      return;
    }

    const result = await applyForLeave(userId, start, end, reason, leaveType);
    res.status(201).json({
      message: 'Leave applied successfully',
      leave: result.leave,
      leavesRemaining: result.balance,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to apply for leave' });
  }
};

export const rollbackLeaveController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.userId;
  const leaveId = req.params.leaveId;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const result = await rollbackLeave(leaveId, userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to rollback leave' });
  }
};
