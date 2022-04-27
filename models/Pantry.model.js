const { Schema, model } = require("mongoose");

const pantrySchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, trim: true, required: [true, 'Display name is required.']},
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }]
  },
  {
    timestamps: true
  }
);

const Pantry = model("Pantry", pantrySchema);

module.exports = Pantry;