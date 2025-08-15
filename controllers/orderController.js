const order = require("../models/order");
const product = require("../models/product");

exports.createOrder = async (req, res) => {
  try {
    const { customer, items } = req.body;

    let totalAmount = 0;
    for (let item of items) {
      const products = await product.findById(item.product);
      if (!products)
        return res.status(404).json({ message: "Product not found" });
      totalAmount += products.price * item.quantity;
      products.stock -= item.quantity;
      await products.save();
    }

    const order = new order({ customer, items, totalAmount });
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await order
      .find()
      .populate("customer")
      .populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
