const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

//req.body = {name, email, password, profilePicture}
const signUp = async (req, res) => {
  try {
    const { name, email, password, profilePicture } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      profilePicture,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  signUp,
};
