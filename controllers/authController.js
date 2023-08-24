const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const Workplace = require("../models/workplaceModel");
const Branch = require("../models/branchModel");
const Leaf = require("../models/leafModel");

//req.body = {name, email, password, profilePicture}
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
      leafName: "Your First Leaf",
      description: "This is your first leaf. You can add tasks to it.",
      tasks: [
        {
          task: "Create a new task",
          order: 1,
          createdBy: "Task Leafs",
          priority: "normal",
        },
        {
          task: "Mark a task as done",
          order: 2,
          createdBy: "Task Leafs",
          priority: "normal",
        },
        {
          task: "Delete a task",
          order: 3,
          createdBy: "Task Leafs",
          priority: "normal",
        },
        {
          task: "Edit a task",
          order: 4,
          createdBy: "Task Leafs",
          priority: "normal",
        },
        {
          task: "Add a new leaf",
          order: 5,
          createdBy: "Task Leafs",
          priority: "normal",
        },
        {
          task: "Add a new branch",
          order: 6,
          createdBy: "Task Leafs",
          priority: "normal",
        },
        {
          task: "Create a new workplace",
          order: 7,
          createdBy: "Task Leafs",
          priority: "normal",
        },
        {
          task: "Invite a Member",
          order: 8,
          createdBy: "Task Leafs",
          priority: "normal",
        },
      ],
    });
    const { _id: personalBranchId } = await Branch.create({
      branchName: "Your First Branch",
      leafs: [leafId],
    });
    const { _id: perosonalWorkplaceId } = await Workplace.create({
      name: "Your First Workplace",
      description: "For you to get startes with",
      branches: [personalBranchId],
      owner: userId,
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
