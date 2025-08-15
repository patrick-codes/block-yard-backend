const product = require("../models/product");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;
    const products = new product({
      name,
      description,
      price,
      stock,
      category,
      image,
    });
    await products.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Product
exports.getProduct = async (req, res) => {
  try {
    const products = await product.findById(req.params.id);
    if (!products)
      return res.status(404).json({ message: "Product not found" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const products = await product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    await product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
