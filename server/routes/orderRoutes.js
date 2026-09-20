import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
  getOrderStats,
} from "../controllers/orderController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Create Order
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  createOrder
);

// router.get("/admin/order", protect, adminOnly, getAllOrders);
// router.get("/admin/order/:id", protect, adminOnly, getAdminOrderById);
// router.patch("/admin/order/:id/status", protect, adminOnly, updateOrderStatus);
// router.get("/admin/order/stats", protect, adminOnly, getOrderStats);

router.get(
  "/admin/order",
  protect,
  adminOnly,
  getAllOrders
);

router.get(
  "/admin/order/stats",
  protect,
  adminOnly,
  getOrderStats
);

router.get(
  "/admin/order/:id",
  protect,
  adminOnly,
  getAdminOrderById
);

router.patch(
  "/admin/order/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

/*
|--------------------------------------------------------------------------
| Get logged-in user's orders
|--------------------------------------------------------------------------
*/

router.get(
  "/my-orders",
  protect,
  getMyOrders
);

/*
|--------------------------------------------------------------------------
| Get single order
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  protect,
  getOrderById
);

export default router;