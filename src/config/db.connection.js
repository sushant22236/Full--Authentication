import mongoose from "mongoose";
import { config } from "./env.js";

export const connectDB = async () => {
    try{
        await mongoose.connect(config.mongoURI);
        console.log("MongoDB connected successfully");
    }catch(error){
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};