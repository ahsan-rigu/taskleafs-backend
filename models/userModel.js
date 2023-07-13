const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: false,
    min: 4,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  profilePicture: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0W4cTMxl3c4u738PdwJvW2xpbVnlvCZcTm-WiqHURQ&s",
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
