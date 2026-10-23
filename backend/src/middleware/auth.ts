import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User, type Role, type AccountStatus } from "../models/User";
import { ApiError } from "../utils/ApiError";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: Role; status: AccountStatus };
    }
  }
}

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) {
    return next(new ApiError(401, "Please log in to continue"));
  }

  let payload: { id: string };
  try {
    payload = jwt.verify(token, env.jwtSecret) as { id: string };
  } catch {
    return next(new ApiError(401, "Your session has expired. Please log in again"));
  }

  const user = await User.findById(payload.id);
  if (!user) {
    return next(new ApiError(401, "Account no longer exists"));
  }
  if (user.status === "suspended") {
    return next(new ApiError(403, "Your account has been suspended"));
  }

  req.user = { id: user.id, role: user.role, status: user.status };
  next();
};

export const authorizeRoles =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to do this"));
    }
    next();
  };
  export const requireApprovedSeller = (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.role === "seller" && req.user.status !== "active") {
    return next(new ApiError(403, "Your seller account is awaiting approval"));
  }
  next();
};