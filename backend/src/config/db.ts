import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection failed:", (error as Error).message);
    process.exit(1);
  }
};