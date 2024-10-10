const mongoose = require("mongoose");

const UserSchama = new mongoose.Schema({
  userName: String,
  userEmail: String,
  password: String,
  role: String,
});

module.exports = mongoose.model("user", UserSchama);
