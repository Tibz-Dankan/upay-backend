import { server } from "./app";
import { AppError } from "./utils/error";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const startApp = async () => {
  const port = process.env.PORT || 5000;
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) return new AppError("MONGO URL not defined", 400);

  // database connection on start

  server.listen(port, () =>
    console.log(`server started and running on port ${port}...`)
  );
};

startApp();
