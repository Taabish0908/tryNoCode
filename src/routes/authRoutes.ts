import express from "express";
import { register, login, logout } from "../controllers/authController";
import { validate } from "../lib/validate";
import { authMiddleware } from "../middlewares/auth";
import {
  loginUserValidation,
  registerUserValidation,
} from "../validations/validation";

const router = express.Router();

router.post("/register", validate(registerUserValidation), register);
router.post("/login", validate(loginUserValidation), login);
router.post("/logout", authMiddleware, logout);

export default router;
