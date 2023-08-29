const mongoose = require("mongoose");

const leafSchema = new mongoose.Schema({
  _id: String,
  leafName: { type: String },
  tasks: [{ task: String, priority: String, createdBy: String, _id: String }],
});

const Leaf = mongoose.model("Leaf", leafSchema);

module.exports = Leaf;
