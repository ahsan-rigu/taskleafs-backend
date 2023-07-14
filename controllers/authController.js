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
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).send({ message: "User Not Found" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).send({ message: "User Not Found" });
    }
    jwt.sign(
      { _id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          res.status(500).send({ message: "Token Generation Failed" });
        } else {
          res.status(200).send({ message: "Logged In", token });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  signUp,
  signIn,
};
