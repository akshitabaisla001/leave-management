
import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { getUserProfile } from '../services/user.service';
import { AuthRequest } from '../middleware/auth.mddleware';
import redisClient from '../config/redis';
import sendEmail from '../utils/sendEmail';
import { serialize } from 'v8';
import  UserModel  from '../model/user.model';
import bcrypt from 'bcrypt';
import  generateToken from '../utils/jwt';
import { otpSchema } from '../validation/auth.validation';
import User, { IUser } from '../model/user.model';
// REGISTER
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {name,email,password} = req.body;
    const userExists = await UserModel.findOne({email});
    if(userExists){
      res.status(400).json({ message: 'User already exists' });
     
      return;
    }

    const user = await registerUser(name,email,password);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp)
  
    await redisClient.setEx(`otp:${email}`, 300, otp);

  
    await sendEmail(email, 'Your OTP Code', `Your OTP is: ${otp}`);

  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
  
};

// LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({email});
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const data = await loginUser(email, password);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// GET PROFILE
// export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     if (!req.user?.userId) {
//       res.status(401).json({ message: 'Unauthorized' });
//       return;
//     }

//     const user = await getUserProfile(req.user.userId);

//     if (!user) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Typing the user as IUser
    const user: IUser = await getUserProfile(req.user.userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Assuming the user profile includes necessary details like leave balances
    res.status(200).json(user); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};







export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate the incoming request using otpSchema
    const { error } = otpSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return; // Exit early if validation fails
    }

    const { email, otp } = req.body;

    // Check OTP stored in Redis
    const storedOtp = await redisClient.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return; // Exit early if OTP is invalid or expired
    }

    // Delete the OTP from Redis after verification
    await redisClient.del(`otp:${email}`);

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return; // Exit early if user is not found
    }

    // Generate the JWT token
    const token = generateToken(user._id.toString());
    res.status(200).json({ message: 'OTP verified', token });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};