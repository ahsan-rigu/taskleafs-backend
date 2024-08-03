const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  postedBy: {
    type: String,
  },
  companyName: {
    type: String,
  },
  comments: Array,
});

const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
