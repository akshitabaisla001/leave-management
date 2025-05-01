
import { Router } from 'express';
import { register, login, verifyOtp } from '../controller/auth.controller';
import validate from '../middleware/validate.middleware';
import { registerSchema, loginSchema, otpSchema } from '../validation/auth.validation';

const router = Router();


router.post('/register', validate(registerSchema), register);

router.post('/login', validate(loginSchema), login);


//router.post('/send-otp', validate(otpSchema), sendOtp);


router.post('/verify-otp', validate(otpSchema), verifyOtp);

export default router;
