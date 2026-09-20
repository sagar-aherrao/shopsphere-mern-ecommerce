import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// ======================================
// PROTECTED ROUTES
// ======================================

// Logged-in user
router.get("/me", protect, getMe);


// ======================================
// ADMIN PROTECTED ROUTE
// ======================================

router.get(
  "/admin-test",
  protect,
  adminOnly,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the Admin Area",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  }
);

export default router;