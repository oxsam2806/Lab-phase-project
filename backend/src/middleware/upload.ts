import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { ApiError } from "../utils/ApiError";

const uploadDir = path.join(process.cwd(), "uploads", "products");
fs.mkdirSync(uploadDir, { recursive: true });

const extensions: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${extensions[file.mimetype]}`;
    cb(null, name);
  },
});

export const uploadProductImages = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, cb) => {
    if (extensions[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new ApiError(400, "Only JPG, PNG or WEBP images are allowed"));
    }
  },
}).array("images", 5);

export const getUploadedFiles = (files: unknown): Express.Multer.File[] =>
  Array.isArray(files) ? files : [];

export const toImageUrl = (file: Express.Multer.File) => `/uploads/products/${file.filename}`;