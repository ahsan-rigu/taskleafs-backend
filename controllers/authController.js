const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

//req.body = {name, email, password, profilePicture}
const signUp = async (req, res) => {
  try {
    const { name, username, password, profilePicture } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      username,
      password: hashedPassword,
    });
    res.status(201).send({ message: "Signed Up" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).send({ message: "Username already exists" });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .send({ message: "Username and Password don't match" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .send({ message: "Username and Password don't match" });
    }
    jwt.sign(
      { _id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          return res.status(500).send({ message: "Token Generation Failed" });
        } else {
          return res.status(200).send({ message: "Logged In", token });
        }
      }
    );
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const verify = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(403).send({ message: "No authorisation" });
  } else {
    const token = authorization.split(" ")[1];
    try {
      jwt.verify(token, process.env.JWT_KEY, (error, { _id }) => {
        if (error) {
          res.status(500).send({ message: error.message });
        }
        req.userId = _id;
        next();
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  }
};

module.exports = {
  signUp,
  signIn,
  verify,
};
