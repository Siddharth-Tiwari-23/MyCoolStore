import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { getProductById as getCatalogProductById } from "../data/products.js";

// ======================
// PLACE ORDER (COD / Direct)
// ======================
export const placeOrder = async (req, res) => {
  try {
    const { products, paymentMethod = "COD", razorpayOrderId = null, razorpayPaymentId = null } = req.body;

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

      // Look up product in MongoDB first, then fallback to authoritative catalog
      let dbProduct = null;
      if (item.productId && item.productId.match(/^[0-9a-fA-F]{24}$/)) {
        dbProduct = await Product.findById(item.productId);
      } else {
        dbProduct = await Product.findOne({
          $or: [{ name: item.name }, { _id: item.productId }],
        });
      }

      let price = 0;
      let name = item.name;
      let image = item.image || "";

      if (dbProduct) {
        price = dbProduct.price;
        name = dbProduct.name;
        image = dbProduct.image || image;

        // Atomic stock decrement with concurrency protection
        const updated = await Product.findOneAndUpdate(
          { _id: dbProduct._id, stock: { $gte: quantity } },
          { $inc: { stock: -quantity } },
          { new: true }
        );

        if (!updated) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${name}. Only ${dbProduct.stock} items remaining.`,
          });
        }
      } else {
        // Fallback to static catalog
        const catalogProduct = getCatalogProductById(item.productId);
        if (!catalogProduct) {
          return res.status(400).json({
            success: false,
            message: `Product ${item.name || item.productId} is unavailable.`,
          });
        }
        price = catalogProduct.price;
        name = catalogProduct.name;
      }

      subTotal += price * quantity;
      totalItems += quantity;

      verifiedProducts.push({
        productId: String(item.productId),
        name,
        image,
        price,
        quantity,
      });
    }

    const shippingFee = totalItems > 0 ? totalItems * 2 : 0;
    const calculatedTotal = subTotal + shippingFee;

    const initialTimeline = [
      {
        status: "Pending",
        timestamp: new Date(),
        note: "Order received and pending processing",
      },
    ];

    const isPaid = paymentMethod === "Razorpay" && Boolean(razorpayPaymentId);

    const order = await Order.create({
      user: req.user.id,
      products: verifiedProducts,
      totalAmount: calculatedTotal,
      orderStatus: isPaid ? "Processing" : "Pending",
      paymentMethod,
      paymentStatus: isPaid ? "Completed" : "Pending",
      razorpayOrderId,
      razorpayPaymentId,
      statusTimeline: isPaid
        ? [
            ...initialTimeline,
            {
              status: "Processing",
              timestamp: new Date(),
              note: "Payment verified via Razorpay. Preparing for dispatch.",
            },
          ]
        : initialTimeline,
    });

    // Clear user's database cart after successful order placement
    await User.findByIdAndUpdate(req.user.id, { cart: [] });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
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
// GET USER'S ORDERS
// ======================
export const getOrders = async (req, res) => {
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

// ======================
// CREATE RAZORPAY ORDER
// ======================
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid positive amount is required",
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_TcobLbTXtDGGCZ";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "EfAFpa1M9ft39jU603jfO26g";

    // Use live Razorpay SDK
    if (keyId && keySecret) {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // amount in paise
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      });

      return res.status(200).json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
        hasRealGateway: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// VERIFY RAZORPAY PAYMENT
// ======================
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required for verification",
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "EfAFpa1M9ft39jU603jfO26g";

    if (keySecret && razorpay_order_id && razorpay_signature) {
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "Cryptographic signature mismatch. Payment verification failed.",
        });
      }
    }

    res.status(200).json({
      success: true,
      verified: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// GET ALL ORDERS (ADMIN ONLY)
// ======================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// UPDATE ORDER STATUS (ADMIN ONLY)
// ======================
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;
    order.statusTimeline.push({
      status,
      timestamp: new Date(),
      note: note || `Order transitioned to ${status}`,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};