import Order from "../models/Order.js";
import User from "../models/User.js";
import { getProductById } from "../data/products.js";

// ======================
// PLACE ORDER
// ======================

export const placeOrder = async (
  req,
  res
) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty. Please add items to place an order.",
      });
    }

    let subTotal = 0;
    let totalItems = 0;
    const verifiedProducts = [];

    for (const item of products) {
      const quantity = parseInt(item.quantity, 10);
      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for item ${item.name || item.productId}`,
        });
      }

      const product = getProductById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.productId} is invalid or no longer available.`,
        });
      }

      subTotal += product.price * quantity;
      totalItems += quantity;

      verifiedProducts.push({
        productId: String(product.id),
        name: product.name,
        image: item.image || "",
        price: product.price,
        quantity,
      });
    }

    const shippingFee = totalItems > 0 ? totalItems * 2 : 0;
    const calculatedTotal = subTotal + shippingFee;

    const order = await Order.create({
      user: req.user.id,
      products: verifiedProducts,
      totalAmount: calculatedTotal,
    });

    // Clear user's database cart after successful order placement
    await User.findByIdAndUpdate(req.user.id, { cart: [] });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================
// GET ORDERS
// ======================

export const getOrders = async (
  req,
  res
) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};