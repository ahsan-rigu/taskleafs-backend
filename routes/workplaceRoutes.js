const router = require("express").Router();
const authController = require("../controllers/authController");
const workplaceController = require("../controllers/workplaceController");

router.post("/", authController.verify, workplaceController.createWorkplace); // create workplace
router.delete("/", authController.verify, workplaceController.deleteWorkplace); // delete workplace
router.put("/invite", authController.verify); //Invite user to workplace
router.put("/member", authController.verify, workplaceController.addMember); //add member to workplace
router.put("/owner"), authController.verify; //change owner of workplace
router.delete(
  "/member",
  authController.verify,
  workplaceController.deleteMember
); //delete member from workplace

module.exports = router;
