const inventory = require("../models/inventory");
const product = require("../models/product");

exports.updateInventory = async (req, res) => {
  try {
    const { productId, quantity, type } = req.body;
    const products = await product.findById(productId);
    if (!products)
      return res.status(404).json({ message: "Product not found" });

    // Adjust stock
    products.stock =
      type === "IN" ? products.stock + quantity : products.stock - quantity;
    await products.save();

    const inventoryRecord = new inventory({
      product: productId,
      quantity,
      type,
    });
    await inventoryRecord.save();

    res.status(200).json({ products, inventoryRecord });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInventory = async (req, res) => {
  try {
    const records = await inventory.find().populate("product");
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
