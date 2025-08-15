const express = require("express");
const router = express.Router();
const {
  getInventory,
  addInventory,
} = require("../controllers/inventoryController");
const auth = require("../middleware/authMiddleware");

router.get("/", getInventory);
router.post("/", auth, addInventory);

module.exports = router;
