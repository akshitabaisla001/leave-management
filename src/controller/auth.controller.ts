




import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { getUserProfile } from '../services/user.service';
import { AuthRequest } from '../middleware/auth.mddleware';
import redisClient from '../config/redis';
import sendEmail from '../utils/sendEmail';

// REGISTER
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const data = await registerUser(name, email, password);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// GET PROFILE
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await getUserProfile(req.user.userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};




// SEND OTP
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

  
    await redisClient.setEx(`otp:${email}`, 300, otp);

  
    await sendEmail(email, 'Your OTP Code', `Your OTP is: ${otp}`);

    res.status(200).json({ message: 'OTP sent to email successfully' });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP are required' });
      return;
    }

 
    const storedOtp = await redisClient.get(`otp:${email}`);

  
    if (!storedOtp) {
      res.status(400).json({ message: 'OTP expired or not found' });
      return;
    }

  
    if (storedOtp !== otp) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    await redisClient.del(`otp:${email}`);

    // Send success response
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






