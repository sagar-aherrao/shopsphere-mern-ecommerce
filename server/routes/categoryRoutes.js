import express from "express";

import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Authenticated users
router.get("/", getCategories);

router.get("/:id", getCategory);

// Admin only
router.post("/", protect, adminOnly, upload.single("image"), createCategory);

router.put("/:id", protect, adminOnly, upload.single("image"), updateCategory);

router.delete("/:id", protect, adminOnly, deleteCategory);



export default router;