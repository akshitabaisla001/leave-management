import jwt from 'jsonwebtoken';


const generateToken = (userId: string): string => {
    console.log('Generating token for user ID:', userId); // Debugging line
  
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET || 'yourVerySecretKey', {
    expiresIn: '7d',  
  });
};

export default generateToken;