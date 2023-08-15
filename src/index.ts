import { app } from "./app";
import { AppError } from "./utils/error";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { PrismaClient } from "@prisma/client";

new PrismaClient();

dotenv.config();

const startApp = async () => {
  const DATABASE_URL_UPAY = process.env.DATABASE_URL_UPAY;
  const PORT = 5000 || process.env.PORT;

  if (!DATABASE_URL_UPAY) {
    console.log("No postgres url");
    throw new Error("No postgres url");
  }

  try {
    const sequelize = new Sequelize(DATABASE_URL_UPAY);

    await sequelize.authenticate();
    console.log("Database connection has been established successfully!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  app.listen(PORT, () => {
    console.log("Server started and running on port: " + PORT + " 🚀");
  });
};

startApp();
