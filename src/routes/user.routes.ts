import express from 'express';
import { protect } from '../middleware/auth.mddleware';
import {
  getUserProfileController,
  updateUserProfileController,
} from '../controller/user.controller';

const router = express.Router();

router.get('/api/profile', protect, getUserProfileController);
router.patch('/api/profile', protect, updateUserProfileController);

export default router;
