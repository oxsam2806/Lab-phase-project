import type { Request, Response } from "express";
import { User, type UserDocument } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { setAuthCookie, clearAuthCookie } from "../utils/generateToken";

const toSafeUser = (user: UserDocument) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
});

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    status: role === "seller" ? "pending" : "active",
  });

  setAuthCookie(res, user.id);
  res.status(201).json({
    user: toSafeUser(user),
    message:
      role === "seller"
        ? "Seller account created. You can start selling once an admin approves it."
        : "Account created successfully",
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  if (user.status === "suspended") {
    throw new ApiError(403, "Your account has been suspended");
  }

  setAuthCookie(res, user.id);
  res.json({ user: toSafeUser(user), message: `Welcome back, ${user.name}` });
};

export const logout = (_req: Request, res: Response) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out successfully" });
};

export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.json({ user: toSafeUser(user) });
};