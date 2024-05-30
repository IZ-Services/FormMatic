import dotenv from 'dotenv';
import { connect } from 'mongoose';

dotenv.config();

const connectDB = async () => {   
	try {
        await connect(process.env.DB_URI!);
        console.log("Successfully connected to MongoDB");
    } catch (error) {
        console.error("Error in connecting to MongoDB:", error);
        throw new Error("Error in connecting to MongoDB.");
    }
}

export default connectDB;
