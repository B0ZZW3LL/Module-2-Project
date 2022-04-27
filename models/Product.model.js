const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    image: { type: String },
    barcode_number: { type: String },
    title: { type: String }, 
    brand: { type: String },
    size: { type: String },
    category: { type: String },
    description: { type: String },
    manufacturer: { type: String },
    qty: { type: String },
    pantryId: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true
  }
);

const Product = model("Product", productSchema);

module.exports = Product;