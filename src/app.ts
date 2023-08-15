import express, { Request, Response } from "express";
import cors from "cors";
import { errorHandler } from "./controllers/errorController";
import { userRoutes } from "./routes/userRoutes";

const app = express();

let url;

if (process.env.NODE_ENV === "production") {
  app.use(cors({ origin: process.env.PRODUCTION_URL }));
  url = process.env.PRODUCTION_URL;
} else {
  app.use(cors());
  url = "http://localhost:3000";
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/v1/api/users", userRoutes);
app.use(errorHandler);

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `error end-point ${req.originalUrl} not found!`,
  });
});

export { app };
