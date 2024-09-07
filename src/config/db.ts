import mongoose from 'mongoose';
import { MONGODB_URI } from '../constants/env';


const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('MongoDB connected');
    } catch (err) {
        console.log('MongoDB connection error. Please make sure MongoDB is running.');
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;