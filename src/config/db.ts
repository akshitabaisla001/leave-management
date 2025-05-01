 import mongoose from 'mongoose';


console.log('Mongo URI:', process.env.MONGO_URI);  

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/leave';  
    if (!dbURI) {
      throw new Error('Mongo URI is not defined');
    }

    await mongoose.connect(dbURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
export default connectDB;