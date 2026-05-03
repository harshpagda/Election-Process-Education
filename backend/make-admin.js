import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const result = await User.updateMany({}, { $set: { role: 'admin' } });
    console.log(`Successfully updated ${result.modifiedCount} users to admin role.`);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

makeAdmin();
