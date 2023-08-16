const router = require("express").Router();
const authController = require("../controllers/authController");
const workplaceController = require("../controllers/workplaceController");

router.post("/", authController.verify); // create workplace
router.put("/member", authController.verify, workplaceController.addMember); //add member to workplace
router.delete("/member", authController.verify, workplaceController.deleteMember); //delete workplace
router.post("/branch", authController.verify); //create branch
router.delete("/branch", authController.verify); //delete branch
router.post("/leaf", authController.verify); //create leaf
router.delete("/leaf", authController.verify); //delete leaf
router.post("/task", authController.verify); //create task
router.delete("/task", authController.verify); //delete task
router.put("/task", authController.verify); //update task

module.exports = router;
