import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";

import {
  placeOrder,
  getOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.post(
  "/place",
  authMiddleware,
  placeOrder
);

router.get(
  "/my-orders",
  authMiddleware,
  getOrders
);

export default router;