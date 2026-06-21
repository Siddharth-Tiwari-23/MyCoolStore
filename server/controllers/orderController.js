import Order from "../models/Order.js";


// ======================
// PLACE ORDER
// ======================

export const placeOrder = async (
  req,
  res
) => {
  try {
    const {
      products,
      totalAmount,
    } = req.body;

    const order = await Order.create({
      user: req.user.id,
      products,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
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
      message: error.message,
    });
  }
};