
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

    const user = await getUserProfile(userId);
    res.status(200).json(user);
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

    const updatedUser = await updateUserProfile(userId, {
      name,
      profilePicture,
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    next(error);
  }
};
