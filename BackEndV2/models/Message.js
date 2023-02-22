const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { collection: "messages" }
);

const Message = mongoose.model("messages", MessageSchema);

module.exports = Message;
