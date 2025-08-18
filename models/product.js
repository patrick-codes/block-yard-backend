const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    category: String,
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

/*
 Dimensions: 16" x 8" x 8"
                            Weight: 32 lbs each
                            Compressive Strength: 1900 psi
                            Water Absorption: < 10%
                            Color: Standard Gray
*/
