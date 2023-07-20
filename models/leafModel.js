const mongoose = require("mongoose");

const leafSchema = new mongoose.Schema({
  branch: [{ type: mongoose.Schema.Types.ObjectId, ref: "Branch" }],
  leafName: { type: String },
  order: { type: Number },
  tasks: [{ task: String, isDone: Boolean }],
});
