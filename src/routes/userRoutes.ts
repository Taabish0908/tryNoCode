import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { getMyProfile } from "../controllers/userController";

const router = express.Router();

router.get("/get-my-info", authMiddleware, getMyProfile);


export default router;
