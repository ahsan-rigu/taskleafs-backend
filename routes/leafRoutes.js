const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const leafController = require("../controllers/leafController");

router.post("/", authController.verify, leafController.createLeaf); //create leaf
router.delete(
  "/:branchId/:leafId",
  authController.verify,
  leafController.deleteLeaf
); //delete leaf
router.put("/", authController.verify, leafController.updateLeaf); //update leaf
router.post("/task", authController.verify, leafController.addTask); //create task
router.delete(
  "/task/:leafId/:taskId",
  authController.verify,
  leafController.deleteTask
); //delete task
router.put("/task", authController.verify, leafController.updateTask); //update task
router.put("/task/move", authController.verify, leafController.moveTask); //update task

module.exports = router;
