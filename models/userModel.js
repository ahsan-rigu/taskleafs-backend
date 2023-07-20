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
    default: "https://stock.adobe.com/search/images?k=unknown+user",
  },
  perosonalWorkplace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workplace",
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
