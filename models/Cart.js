const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    memberId: { type: String, required: true },
    packages: [
        {
            packagesId: {
                type: String
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
