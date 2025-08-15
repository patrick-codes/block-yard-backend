const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getOrders);
router.patch("/:orderId/status", updateOrderStatus);

module.exports = router;
