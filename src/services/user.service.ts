
import UserModel from '../model/user.model';

/**
 * Fetch the user's profile details by ID.
 */
export const getUserProfile = async (userId: string) => {
  const user = await UserModel.findById(userId).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

/**
 * Update the user's profile (name and/or profile picture).
 */
export const updateUserProfile = async (
  userId: string,
  updates: { name?: string; profilePicture?: string }
) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-password');

  if (!updatedUser) throw new Error('User not found or update failed');
  return updatedUser;
};
