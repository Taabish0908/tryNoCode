import express from "express";
import { createOrder, getOrdersForUser } from "../controllers/orderController";
import { authMiddleware } from "../middlewares/auth";
import { validate } from "../lib/validate";
import { createOrderValidation } from "../validations/validation";

const router = express.Router();

router.post(
  "/create-order",
  authMiddleware,
  validate(createOrderValidation),
  createOrder
);
router.get("/get-my-orders", authMiddleware, getOrdersForUser);

export default router;
