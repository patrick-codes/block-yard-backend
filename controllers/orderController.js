const order = require("../models/order");
const product = require("../models/product");
const user = require("../models/user");
const sendSmsHelper = require("../services/smsService");
const { sendOrderNotification } = require("../services/notificationService");

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

    // New order with "Processing" status after stock deduction
    const newOrder = new order({
      customer,
      items,
      totalAmount,
      status: "Processed",
    });

    await newOrder.save();

    const newuser = await user.findById(req.body.userId);

    let phone = newuser.phone;
    if (phone.startsWith("0")) {
      phone = "233" + phone.slice(1);
    }

    await sendSmsHelper({
      to: phone,
      content: `Dear ${newuser.name}, your order #${newOrder.id} has being received. We will notify you when it is dispatched. Track your order: https://yourshop.com/orders/${newOrder.id}`,
    });

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
      .populate("items.product", "name price image");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: er.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      "Pending",
      "Processed",
      "Shipped",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }

    const orderData = await order.findById(req.params.orderId);
    if (!orderData) {
      return res.status(404).json({ message: "Order not found" });
    }

    orderData.status = status;
    orderData.statusHistory.push({
      status,
      changedBy: req.user?.id || "system",
    });

    await orderData.save();

    const newuser = await user.findById(orderData.customer);
    if (!newuser) {
      return res.status(404).json({ message: "User not found" });
    }

    let phone = newuser.phone;
    if (phone.startsWith("0")) {
      phone = "233" + phone.slice(1);
    }

    await sendSmsHelper({
      to: phone,
      content: `Hello ${newuser.name}, your order #${orderData.id} status has been ${orderData.status}.`,
    });

    await sendOrderNotification(orderData, status);

    res.json({
      message: `Order status updated to ${status}`,
      order: orderData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminMarksOrder = async (req, res) => {
  try {
    const neworder = await order.findById(req.params.id);

    if (!neworder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (neworder.status !== "Processed") {
      return res
        .status(400)
        .json({ message: "Order must be in Processing before shipping" });
    }

    neworder.status = "Shipped";
    neworder.paymentStatus = "Paid";
    neworder.shippedAt = new Date();

    await neworder.save();

    const newuser = await user.findById(neworder.customer);
    if (!newuser) {
      return res.status(404).json({ message: "User not found" });
    }

    let phone = newuser.phone;
    if (phone.startsWith("0")) {
      phone = "233" + phone.slice(1);
    }

    await sendSmsHelper({
      to: phone,
      content: `Hello ${newuser.name}, your order #${neworder.id} status has been updated to: ${neworder.status}.`,
    });

    await sendOrderNotification(neworder, "Shipped");

    res.json({ message: "Order marked as shipped", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
