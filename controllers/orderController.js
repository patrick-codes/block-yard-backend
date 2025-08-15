const order = require("../models/order");
const product = require("../models/product");

exports.createOrder = async (req, res) => {
  try {
    const customer = req.body.customer || req.body.userId;
    const items =
      req.body.items ||
      req.body.products?.map((p) => ({
        product: p.productId,
        quantity: p.quantity,
      }));

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Items array is required" });
    }

    let totalAmount = 0;
    for (let item of items) {
      const productData = await product.findById(item.product);
      if (!productData) {
        return res.status(404).json({ message: "Product not found" });
      }
      totalAmount += productData.price * item.quantity;
      productData.stock -= item.quantity;
      await productData.save();
    }

    const newOrder = new order({ customer, items, totalAmount });
    await newOrder.save();

    res.status(201).json(newOrder);
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
