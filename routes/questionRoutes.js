const express = require("express");
const router = express.Router();

const questionController = require("../controllers/questionController");

router.get("/", questionController.getQuestions);
router.post("/", questionController.createQuestion);
router.post("/comment", questionController.addComment);
router.get("/:id", questionController.getQuestion);

module.exports = router;
