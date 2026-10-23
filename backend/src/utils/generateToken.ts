import jwt from "jsonwebtoken";
import type { Response } from "express";
import { env } from "../config/env";

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "strict" as const,
};

export const setAuthCookie = (res: Response, userId: string) => {
  const token = jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: "7d" });
  res.cookie("token", token, { ...cookieOptions, maxAge: SEVEN_DAYS });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie("token", cookieOptions);
};