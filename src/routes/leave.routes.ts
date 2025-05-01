
import express from 'express';
import { applyForLeaveController,rollbackLeaveController } from '../controller/leave.controller';
import { protect } from '../middleware/auth.mddleware';

const router = express.Router();

router.post('/apply', protect, applyForLeaveController); 
router.delete('/rollback', protect, rollbackLeaveController);
export default router;



