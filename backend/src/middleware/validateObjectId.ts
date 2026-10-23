import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const validateObjectIdParam =
  (param: string) => (req: Request, _res: Response, next: NextFunction) => {
    const value = req.params[param];
    if (typeof value !== "string" || !/^[a-f\d]{24}$/i.test(value)) {
      return next(new ApiError(400, "Invalid id"));
    }
    next();
  };