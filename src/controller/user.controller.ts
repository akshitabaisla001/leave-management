
import { Request, Response, NextFunction } from 'express';
import { getUserProfile, updateUserProfile } from '../services/user.service';
import { AuthRequest } from '../middleware/auth.mddleware';

export const getUserProfileController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: User ID missing' });
      return;
    }

    // Fetch the user's profile data including the leave balances
    const user = await getUserProfile(userId);

    // Return the user's profile along with their leave balance details
    res.status(200).json({
      message: 'User profile fetched successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        plannedLeavesRemaining: user.plannedLeavesRemaining,
        emergencyLeavesRemaining: user.emergencyLeavesRemaining,
        shortLeavesRemaining: user.shortLeavesRemaining,
        leaveHistory: user.leaveHistory,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateUserProfileController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: User ID missing' });
      return;
    }

    const { name, profilePicture } = req.body;

    // Update user profile details
    const updatedUser = await updateUserProfile(userId, {
      name,
      profilePicture,
    });

    // Return the updated profile along with the leave balance
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        plannedLeavesRemaining: updatedUser.plannedLeavesRemaining,
        emergencyLeavesRemaining: updatedUser.emergencyLeavesRemaining,
        shortLeavesRemaining: updatedUser.shortLeavesRemaining,
        leaveHistory: updatedUser.leaveHistory,
      },
    });
  } catch (error: any) {
    next(error);
  }
};
