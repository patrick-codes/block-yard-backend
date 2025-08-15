const Order = require("../models/order");
const Product = require("../models/product");

// Total sales
exports.getTotalSales = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: "Paid" });
    const totalSales = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    res.json({ totalSales });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Top-selling products
exports.getTopProducts = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product");
    const productSales = {};

    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        if (item.product) {
          const productName = item.product.name;
          productSales[productName] =
            (productSales[productName] || 0) + item.quantity;
        }
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Low stock alerts
exports.getLowStock = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } });
    res.json(lowStockProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
