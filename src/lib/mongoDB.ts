import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();

const connect = async () => {
    try {
        console.log("DB_URI:", process.env.DB_URI); // Log the DB_URI to verify it's correctly loaded
        await mongoose.connect(process.env.DB_URI!);
        console.log("Successfully connected to MongoDB");
    } catch (error) {
        console.error("Error in connecting to MongoDB:", error);
        throw new Error("Error in connecting to MongoDB.");
    }
}

export default connect;
