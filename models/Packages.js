const mongoose = require("mongoose");

const PackagesSchema = new mongoose.Schema(
  {
    dealId: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    price: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Packages", PackagesSchema);
