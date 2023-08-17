const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const leafController = require("../controllers/leafController");

router.post("/leaf", authController.verify); //create leaf
router.delete("/leaf", authController.verify); //delete leaf
router.post("/task", authController.verify); //create task
router.delete("/task", authController.verify); //delete task
router.put("/task", authController.verify); //update task (status and position)

module.exports = router;
