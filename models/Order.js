const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    packages: [
      {
        _id: { type: String },
        title: { type: String },
        desc: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        totalPrice: { type: Number },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
