const mongoose = require("mongoose");

const DealsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    categories: {type: Array, required: true },
    fixedPrice: { type: Number, required: true },
    dealPrice: { type: Number, required: true },
    featured: {type: Boolean, default: false},
    highlight: {type: Boolean, default: false},
    tc: {type: String, required: true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deals", DealsSchema);
