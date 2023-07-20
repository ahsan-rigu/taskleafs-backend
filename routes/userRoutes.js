const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
router.post("/authorize-token", authController.verify, async (req, res) =>
  res.send({ message: "Welcome Back" })
);

module.exports = router;
