const mongoose = require("mongoose");

const leafSchema = new mongoose.Schema({
  leafName: { type: String },
  order: { type: Number },
  tasks: [{ task: String, priority: String, createdBy: String }],
});

const Leaf = mongoose.model("Leaf", leafSchema);

module.exports = Leaf;
