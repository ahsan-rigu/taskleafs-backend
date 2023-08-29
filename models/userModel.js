const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: false,
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
  workplaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workplace",
    },
  ],
  invitations: [
    {
      workplaceId: mongoose.Schema.Types.ObjectId,
      name: String,
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
