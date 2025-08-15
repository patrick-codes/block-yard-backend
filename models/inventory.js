const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    blockType: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
