const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: {type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 8 },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
