import express from "express";
import {
  addProduct,
  getProductById,
  getAllProducts,
} from "../controllers/productController";

const router = express.Router();

router.post("/add-product", addProduct);
router.get("/get-product:productId", getProductById);
router.get("/get-all-products", getAllProducts);

export { router as productRoutes };
