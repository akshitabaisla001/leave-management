
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }

  const token = authHeader.split(' ')[1];  

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourVerySecretKey') as { userId: string };
    req.user = { userId: decoded.userId };  

    next();  
  } catch (error) {
    console.error('Token verification failed:', error);  
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};



