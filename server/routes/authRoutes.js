import express from "express";

import {
  register,
  login,
  getProfile,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  toggleRole,
} from "../controllers/authController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);

router.post(
  "/wishlist/add",
  authMiddleware,
  addToWishlist
);

router.post(
  "/wishlist/remove",
  authMiddleware,
  removeFromWishlist
);

router.post(
  "/cart/add",
  authMiddleware,
  addToCart
);

router.post(
  "/cart/update",
  authMiddleware,
  updateCartQuantity
);

router.post(
  "/cart/remove",
  authMiddleware,
  removeFromCart
);

router.post(
  "/cart/clear",
  authMiddleware,
  clearCart
);

router.post(
  "/toggle-role",
  authMiddleware,
  toggleRole
);

export default router;