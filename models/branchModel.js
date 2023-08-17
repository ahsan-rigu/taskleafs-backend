const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
  },
  leafs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Leaf" }],
});

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
