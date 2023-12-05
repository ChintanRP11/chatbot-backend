const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  chatHistory: [
    {
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      sent: { type: Boolean, required: true },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
