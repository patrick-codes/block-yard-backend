const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  adminMarksOrder,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getOrders);
router.patch("/:orderId/status", updateOrderStatus);

router.put("/:id/ship", adminMarksOrder);

module.exports = router;
