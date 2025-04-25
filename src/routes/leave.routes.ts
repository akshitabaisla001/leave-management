
import express from 'express';
import { applyForLeaveController } from '../controller/leave.controller';
import { protect } from '../middleware/auth.mddleware';

const router = express.Router();

router.post('/apply', protect, applyForLeaveController); 

export default router;



