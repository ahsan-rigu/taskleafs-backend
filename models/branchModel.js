const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
  },
  leafs: [String],
});

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
