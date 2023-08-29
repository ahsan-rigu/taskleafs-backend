const router = require("express").Router();
const authController = require("../controllers/authController");
const workplaceController = require("../controllers/workplaceController");

router.post("/", authController.verify, workplaceController.createWorkplace); // create workplace
router.delete(
  "/:workplaceId",
  authController.verify,
  workplaceController.deleteWorkplace
); // delete workplace
router.put("/", authController.verify, workplaceController.updateWorkplace); // update workplace
router.put("/invite", authController.verify, workplaceController.inviteUser); //Invite user to workplace
router.put("/decline", authController.verify, workplaceController.deleteInvite); //Invite user to workplace
router.put("/accept", authController.verify, workplaceController.addMember); //add member to workplace
router.put("/owner"), authController.verify, workplaceController.changeOwner; //change owner of workplace
router.delete(
  "/member",
  authController.verify,
  workplaceController.deleteMember
); //delete member from workplace

module.exports = router;
