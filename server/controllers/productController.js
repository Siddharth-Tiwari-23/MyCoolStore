import Product from "../models/Product.js";

// ======================
// GET ALL PRODUCTS
// ======================
export const getProducts = async (req, res) => {
  try {
    const { category, search, onSale, newArrival, sort } = req.query;
    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    if (onSale === "true") {
      filter.onSale = true;
    }

    if (newArrival === "true") {
      filter.newArrival = true;
    }

    let query = Product.find(filter);

    if (sort === "price-asc") {
      query = query.sort({ price: 1 });
    } else if (sort === "price-desc") {
      query = query.sort({ price: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const products = await query;

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// GET SINGLE PRODUCT BY ID
// ======================
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    // Support both MongoDB ObjectId and numeric catalog IDs (for backward compatibility)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({
        $or: [{ _id: id }, { name: { $regex: new RegExp(`^${id}$`, "i") } }],
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// CREATE PRODUCT (ADMIN ONLY)
// ======================
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, oldPrice, onSale, newArrival, image, stock, description } = req.body;

    if (!name || !category || price === undefined || !image) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, category, price, and image URL",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      category,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : 0,
      onSale: Boolean(onSale),
      newArrival: Boolean(newArrival),
      image: image.trim(),
      stock: stock !== undefined ? Number(stock) : 50,
      description: description || "Premium quality product from MyCoolStore.",
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// UPDATE PRODUCT (ADMIN ONLY)
// ======================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// DELETE PRODUCT (ADMIN ONLY)
// ======================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
