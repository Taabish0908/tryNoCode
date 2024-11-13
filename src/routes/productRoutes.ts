import express from "express";
import { createProduct, getProducts } from "../controllers/productController";
import { validate, validateQueryParams } from "../lib/validate";
import { addProduct, getProductsValidation } from "../validations/validation";

const router = express.Router();

router.post("/crete-product", validate(addProduct), createProduct);
router.get(
  "/get-products",
  validateQueryParams(getProductsValidation),
  getProducts
);
export default router;
