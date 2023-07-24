const mongoose = require("mongoose");

const workplaceSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  workplaceName: {
    type: String,
    required: true,
  },
  description: { type: String },
  branches: [String],
});

const Workplace = mongoose.model("Workplace", workplaceSchema);

module.exports = Workplace;
