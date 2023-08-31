const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

const User = require("../models/userModel");
const Workplace = require("../models/workplaceModel");
const Branch = require("../models/branchModel");
const Leaf = require("../models/leafModel");

const signUp = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const { _id: userId } = await User.create({
      name,
      username,
      password: hashedPassword,
    });
    const { _id: leafId } = await Leaf.create({
      _id: new mongoose.mongo.ObjectId(),
      leafName: "Your First Leaf",
      tasks: [
        {
          task: "Create a new task",
          _id: new mongoose.mongo.ObjectId(),
          createdBy: "Task Leafs",
          priority: "normal",
        },
        {
          task: "Delete a task",
          _id: new mongoose.mongo.ObjectId(),
          createdBy: name,
          priority: "normal",
        },
        {
          task: "Edit a task",
          _id: new mongoose.mongo.ObjectId(),
          createdBy: name,
          priority: "normal",
        },
        {
          task: "Add a new leaf",
          _id: new mongoose.mongo.ObjectId(),
          createdBy: name,
          priority: "normal",
        },
        {
          task: "Add a new branch",
          _id: new mongoose.mongo.ObjectId(),
          createdBy: name,
          priority: "normal",
        },
        {
          task: "Create a new workplace",
          _id: new mongoose.mongo.ObjectId(),
          createdBy: name,
          priority: "normal",
        },
        {
          task: "Invite a Member",
          _id: new mongoose.mongo.ObjectId(),
          createdBy: name,
          priority: "normal",
        },
      ],
    });
    const { _id: personalBranchId } = await Branch.create({
      _id: new mongoose.mongo.ObjectId(),
      branchName: "Your First Branch",
      leafs: [leafId],
    });
    const { _id: perosonalWorkplaceId } = await Workplace.create({
      name: "Your First Workplace",
      description:
        "For you to get started with, explore the features, and reuse as you see fit",
      branches: [personalBranchId],
      owner: userId,
      members: [{ _id: userId, name: name, username: username }],
    });
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { workplaces: perosonalWorkplaceId } }
    );
    return res.status(201).send({ message: "Signed Up" });
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
      console.log(error);
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
