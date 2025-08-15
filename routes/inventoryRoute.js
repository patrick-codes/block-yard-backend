const express = require("express");
const router = express.Router();
const {
  updateInventory,
  getInventory,
} = require("../controllers/inventoryController");

router.post("/update", updateInventory);
router.get("/", getInventory);

module.exports = router;
