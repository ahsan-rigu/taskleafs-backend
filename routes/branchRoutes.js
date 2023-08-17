const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const branchController = require("../controllers/branchController");

router.post("/", authController.verify); //create branch
router.delete("/", authController.verify); //delete branch

module.exports = router;
