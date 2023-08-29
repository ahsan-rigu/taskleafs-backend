const mongoose = require("mongoose");

const workplaceSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  members: [
    { _id: mongoose.Schema.Types.ObjectId, name: String, username: String },
  ],
  description: { type: String },
  branches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Branch" }],
});

const Workplace = mongoose.model("Workplace", workplaceSchema);

module.exports = Workplace;
