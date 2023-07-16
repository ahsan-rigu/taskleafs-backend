const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  profilePicture: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
