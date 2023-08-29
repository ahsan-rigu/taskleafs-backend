const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const branchController = require("../controllers/branchController");

router.post("/", authController.verify, branchController.createBranch); //create branch
router.delete(
  "/:workplaceId/:branchId",
  authController.verify,
  branchController.deleteBranch
); //delete branch
router.put("/", authController.verify, branchController.updateBranchName); //update branch

module.exports = router;
