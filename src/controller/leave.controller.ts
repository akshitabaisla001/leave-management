
import { Request, Response } from 'express';
import moment from 'moment';
import { applyForLeave } from '../services/leave.services';


interface ApplyLeaveRequestBody {
  startDate: string; 
  endDate: string;   
  reason: string;
  leaveType: 'emergency' | 'planned';
}

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const applyForLeaveController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { startDate, endDate, reason, leaveType }: ApplyLeaveRequestBody = req.body;
  const userId = req.user?.userId; 

  console.log('User ID:', userId); 


  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: User ID missing' });
    return;
  }

  if (!['emergency', 'planned'].includes(leaveType)) {
    res.status(400).json({ message: 'Invalid leave type. It must be "emergency" or "planned".' });
    return;
  }

  try {
 
    const formattedStartDate = moment(startDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
    const formattedEndDate = moment(endDate, 'YYYY-MM-DD').format('YYYY-MM-DD');


    const start = moment(formattedStartDate, 'YYYY-MM-DD').toDate();
    const end = moment(formattedEndDate, 'YYYY-MM-DD').toDate();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ message: 'Invalid date format' });
      return;
    }

 
    const leave = await applyForLeave(userId, start, end, reason, leaveType);


    res.status(201).json({ message: 'Leave applied successfully', leave });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to apply for leave' });
  }
};

  


