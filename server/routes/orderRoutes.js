import express from "express";
import authMiddleware, { adminMiddleware } from "../middlewares/authMiddleware.js";
import {
  placeOrder,
  getOrders,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// Customer routes
router.post("/place", authMiddleware, placeOrder);
router.get("/my-orders", authMiddleware, getOrders);
router.post("/razorpay-create", authMiddleware, createRazorpayOrder);
router.post("/razorpay-verify", authMiddleware, verifyRazorpayPayment);

// Admin-only routes
router.get("/all", authMiddleware, adminMiddleware, getAllOrders);
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;