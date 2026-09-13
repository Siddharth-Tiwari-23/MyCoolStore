import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import { defaultProducts } from "./data/products.js";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

connectDB().then(async () => {
  // Auto-seed initial catalog if Product collection is empty
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("Seeding initial products into MongoDB...");
      await Product.insertMany(defaultProducts);
      console.log("Product catalog successfully seeded! 🌱");
    }
  } catch (err) {
    console.error("Auto-seeding error:", err.message);
  }
});

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("MyCoolStore Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});