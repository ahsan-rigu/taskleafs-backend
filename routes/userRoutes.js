const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
router.post("/verify", authController.verify);
router.post("/authorize", authController.verify, async (req, res) =>
  res.send("Authorized")
);

module.exports = router;
