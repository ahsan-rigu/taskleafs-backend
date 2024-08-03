const Question = require("../models/QuestionModel");

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    return res.status(200).send(questions);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    return res.status(201).send(question);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { questionId, comment } = req.body;
    const question = await Question.findOneAndUpdate(
      { _id: questionId },
      { $push: { comments: comment } }
    );
    return res.status(200).send(question);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    return res.status(200).send(question);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getQuestions,
  createQuestion,
  addComment,
  getQuestion,
};
