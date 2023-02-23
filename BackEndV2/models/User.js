const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    admin: { type: Boolean },
  },
  { collection: "users" }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
