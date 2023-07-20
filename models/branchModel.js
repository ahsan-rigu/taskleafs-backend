const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  workplace: { type: mongoose.Schema.Types.ObjectId, ref: "Workplace" },
  branchName: {
    type: String,
    required: true,
  },
});
