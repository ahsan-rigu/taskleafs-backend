const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const branchController = require("../controllers/branchController");

router.post("/", authController.verify, branchController.createBranch); //create branch
router.delete("/", authController.verify, branchController.deleteBranch); //delete branch
router.put("/", authController.verify, branchController.updateBranch); //update branch

module.exports = router;
