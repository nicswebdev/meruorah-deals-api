const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", VendorSchema);
