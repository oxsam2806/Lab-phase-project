import { env } from "./config/env";
import { connectDB } from "./config/db";
import app from "./app";

const start = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
};

start();