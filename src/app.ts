import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import leaveRoutes from './routes/leave.routes';
import userRoutes from './routes/user.routes'; 


dotenv.config();  

const app = express();


app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/user', userRoutes); 


app.get('/', (_req, res) => {
  res.send('Leave Management API is running');
});

// MongoDB connection
const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/leave';  
    console.log('Mongo URI:', dbURI);  
    await mongoose.connect(dbURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};


const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
  });
};

startServer();

 
