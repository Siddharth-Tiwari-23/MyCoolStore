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
    const {
      products,
      paymentMethod = "COD",
      razorpayOrderId = null,
      razorpayPaymentId = null,
      razorpaySignature = null,
    } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty. Please add items to place an order.",
      });
    }

    // Step 1: Authoritative catalog validation and stock check before modifying any state
    let subTotal = 0;
    let totalItems = 0;
    const validatedItems = [];

    for (const item of products) {
      const quantity = parseInt(item.quantity, 10);
      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for item ${item.name || item.productId}`,
        });
      }

      // Authoritative lookup: MongoDB first, fallback to static catalog
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
        if (dbProduct.stock < quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${dbProduct.name}. Only ${dbProduct.stock} items remaining.`,
          });
        }
        price = dbProduct.price;
        name = dbProduct.name;
        image = dbProduct.image || image;
      } else {
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

      validatedItems.push({
        dbProduct,
        productId: String(item.productId),
        name,
        image,
        price,
        quantity,
      });
    }

    const shippingFee = totalItems > 0 ? totalItems * 2 : 0;
    const calculatedTotal = subTotal + shippingFee;
    const expectedAmountPaise = Math.round(calculatedTotal * 100);

    // Step 2: Strict authoritative Razorpay verification
    if (paymentMethod === "Razorpay") {
      // A. Mandatory presence of all cryptographic parameters (Prevents Signature Bypass)
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({
          success: false,
          message: "Razorpay order ID, payment ID, and cryptographic signature are all required.",
        });
      }

      // B. Replay Attack Prevention (Ensures payment ID hasn't been redeemed previously)
      const existingOrder = await Order.findOne({ razorpayPaymentId });
      if (existingOrder) {
        return res.status(400).json({
          success: false,
          message: "This payment transaction has already been used for another order.",
        });
      }

      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!keyId || !keySecret) {
        return res.status(500).json({
          success: false,
          message: "Razorpay gateway credentials are not configured on the server.",
        });
      }

      // C. Cryptographic HMAC-SHA256 signature verification with timing-safe comparison
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      const expectedBuf = Buffer.from(expectedSignature, "utf-8");
      const receivedBuf = Buffer.from(razorpaySignature, "utf-8");

      if (
        expectedBuf.length !== receivedBuf.length ||
        !crypto.timingSafeEqual(expectedBuf, receivedBuf)
      ) {
        return res.status(400).json({
          success: false,
          message: "Cryptographic signature mismatch. Payment verification failed.",
        });
      }

      // D. Direct verification with Razorpay Gateway API (Amount & Capture check)
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const paymentRecord = await razorpay.payments.fetch(razorpayPaymentId);

      if (!paymentRecord) {
        return res.status(400).json({
          success: false,
          message: "Payment transaction record not found with Razorpay.",
        });
      }

      if (paymentRecord.order_id !== razorpayOrderId) {
        return res.status(400).json({
          success: false,
          message: "Payment record does not correspond to the requested Razorpay order.",
        });
      }

      if (!["captured", "authorized"].includes(paymentRecord.status)) {
        return res.status(400).json({
          success: false,
          message: `Payment status is '${paymentRecord.status}'. Only captured payments can be completed.`,
        });
      }

      if (paymentRecord.amount !== expectedAmountPaise) {
        return res.status(400).json({
          success: false,
          message: `Payment amount mismatch: Expected ₹${calculatedTotal} (${expectedAmountPaise} paise) but gateway received ${paymentRecord.amount} paise.`,
        });
      }
    }

    // Step 3: Concurrency-safe atomic stock decrement (only after payment is 100% verified)
    for (const item of validatedItems) {
      if (item.dbProduct) {
        const updated = await Product.findOneAndUpdate(
          { _id: item.dbProduct._id, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!updated) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${item.name}.`,
          });
        }
      }
    }

    const verifiedProducts = validatedItems.map(({ productId, name, image, price, quantity }) => ({
      productId,
      name,
      image,
      price,
      quantity,
    }));

    const isPaid = paymentMethod === "Razorpay";
    const initialTimeline = [
      {
        status: "Pending",
        timestamp: new Date(),
        note: "Order received and pending processing",
      },
    ];

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
    const { products, amount } = req.body;

    let calculatedTotal = 0;

    // Step 1: Compute authoritative amount from database products if provided
    if (Array.isArray(products) && products.length > 0) {
      let subTotal = 0;
      let totalItems = 0;

      for (const item of products) {
        const quantity = parseInt(item.quantity, 10);
        if (isNaN(quantity) || quantity <= 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid quantity for item ${item.name || item.productId}`,
          });
        }

        let dbProduct = null;
        if (item.productId && item.productId.match(/^[0-9a-fA-F]{24}$/)) {
          dbProduct = await Product.findById(item.productId);
        } else {
          dbProduct = await Product.findOne({
            $or: [{ name: item.name }, { _id: item.productId }],
          });
        }

        let price = 0;
        if (dbProduct) {
          price = dbProduct.price;
        } else {
          const catalogProduct = getCatalogProductById(item.productId);
          if (!catalogProduct) {
            return res.status(400).json({
              success: false,
              message: `Product ${item.name || item.productId} is unavailable.`,
            });
          }
          price = catalogProduct.price;
        }

        subTotal += price * quantity;
        totalItems += quantity;
      }

      const shippingFee = totalItems > 0 ? totalItems * 2 : 0;
      calculatedTotal = subTotal + shippingFee;
    } else if (amount && !isNaN(amount) && Number(amount) > 0) {
      // Fallback for legacy calls
      calculatedTotal = Number(amount);
    } else {
      return res.status(400).json({
        success: false,
        message: "Products list or a valid positive amount is required to create a payment order.",
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(500).json({
        success: false,
        message: "Razorpay payment gateway credentials are not configured on the server.",
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const amountInPaise = Math.round(calculatedTotal * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
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

    // Fix: Prevent Signature Bypass via Optional Fields (Require all 3 fields)
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Order ID, Payment ID, and Signature are all strictly required for cryptographic verification.",
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return res.status(500).json({
        success: false,
        message: "Razorpay secret key is not configured on the server.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, "utf-8");
    const receivedBuf = Buffer.from(razorpay_signature, "utf-8");

    if (
      expectedBuf.length !== receivedBuf.length ||
      !crypto.timingSafeEqual(expectedBuf, receivedBuf)
    ) {
      return res.status(400).json({
        success: false,
        message: "Cryptographic signature mismatch. Payment verification failed.",
      });
    }

    res.status(200).json({
      success: true,
      verified: true,
      message: "Payment signature verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
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