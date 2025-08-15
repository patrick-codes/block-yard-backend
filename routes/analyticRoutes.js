const express = require("express");
const router = express.Router();
const {
  getTotalSales,
  getTopProducts,
  getLowStock,
} = require("../controllers/analyticsController");
const auth = require("../middleware/authMiddleware");

// Admin analytics
router.get("/total-sales", auth, getTotalSales);
router.get("/top-products", auth, getTopProducts);
router.get("/low-stock", auth, getLowStock);

module.exports = router;
