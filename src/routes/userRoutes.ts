import express from "express";
import {
  signup,
  signin,
  resetPassword,
  forgotPassword,
} from "../controllers/userController";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

export { router as userRoutes };
