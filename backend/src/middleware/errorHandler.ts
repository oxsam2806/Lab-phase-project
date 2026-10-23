import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";
import { getUploadedFiles, toImageUrl } from "./upload";
import { deleteFiles } from "../utils/files";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const files = getUploadedFiles(req.files);
  if (files.length) {
    deleteFiles(files.map(toImageUrl));
  }

  let statusCode = 500;
  let message = "Something went wrong on the server";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err?.name === "MulterError") {
    statusCode = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Each image must be 2MB or smaller"
        : err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE"
          ? "You can upload up to 5 images"
          : "Image upload failed";
  } else if (err?.code === 11000) {
    statusCode = 409;
    message = "That record already exists";
  } else if (err?.name === "ValidationError" || err?.name === "CastError") {
    statusCode = 400;
    message = "Invalid data provided";
  } else {
    console.error(err);
  }

  res.status(statusCode).json({
    message,
    ...(env.nodeEnv === "development" && statusCode === 500 ? { stack: err?.stack } : {}),
  });
};