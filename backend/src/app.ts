import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { env } from "./config/env";
import routes from "./routes";
import { apiLimiter } from "./middleware/rateLimiter";
import { notFound, errorHandler } from "./middleware/errorHandler";
import path from "path";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.get("/api/health", (_req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: "ok",
    message: dbConnected ? "API and database are running" : "API running, database not connected",
  });
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api", apiLimiter);
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;