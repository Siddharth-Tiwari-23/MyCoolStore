import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Kids"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    oldPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    onSale: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 50,
      min: 0,
    },
    description: {
      type: String,
      default: "Premium quality product from MyCoolStore. Designed for comfort, style, and everyday use.",
    },
    ratings: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ category: 1, name: 1 });

export default mongoose.model("Product", productSchema);
