const mongoose = require("mongoose");

const workdplaceSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  workplaceName: {
    type: String,
    required: true,
  },
  description: { type: String },
});
