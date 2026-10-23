import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { User } from "../models/User";

const run = async () => {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first");
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = "admin";
    existing.status = "active";
    await existing.save();
    console.log(`Existing user ${email} is now an admin`);
  } else {
    await User.create({ name: "Admin", email, password, role: "admin", status: "active" });
    console.log(`Admin account created for ${email}`);
  }

  await mongoose.disconnect();
};

run();