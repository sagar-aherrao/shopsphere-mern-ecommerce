import express from "express";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Get all Products - Authenticated users
router.get(
  "/",
  getProducts
);

// Get single Product - Authenticated users
router.get(
  "/:id",
  getProduct
);

// Create Product - Admin only
router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 5),
  createProduct
);



// Update Product - Admin only
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 5),
  updateProduct
);

// Delete Product - Admin only
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

router.delete(
  "/:id/images",
  protect,
  adminOnly,
  deleteProductImage
);

export default router;