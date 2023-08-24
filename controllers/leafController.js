const Branch = require("../models/branchModel");
const Leaf = require("../models/leafModel");

const createLeaf = async (req, res) => {
  try {
    const { branchId, userId, leafName, order } = req.body;
    //rej if user not in members
    const leaf = await Leaf.create({ leafName, order });
    Branch.findOneAndUpdate({ _id: branchId }, { $push: { leafs: leaf._id } });
    return res.status(200).send({
      message: "Leaf Created",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const deleteLeaf = async (req, res) => {
  try {
    const { leafId, branchId, userId } = req.body;
    //rej if user not in members
    await Leaf.deleteOne({ _id: leafId });
    await Branch.findOneAndUpdate(
      { _id: branchId },
      { $pull: { leafs: leafId } }
    );
    return res.status(200).send({
      message: "Leaf Deleted",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const updateLeaf = async (req, res) => {
  try {
    const { leafId, leafName } = req.body;
    await Leaf.findOneAndUpdate({ _id: leafId }, { leafName });
    return res.status(200).send({
      message: "Leaf Updated",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const addTask = async (req, res) => {
  try {
    const { leafId, task, order, createdBy, priority } = req.body;
    await Leaf.findOneAndUpdate(
      { _id: leafId },
      { $push: { tasks: { task, order, createdBy, priority } } }
    );
    return res.status(200).send({
      message: "Task Added",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { leafId, taskId } = req.body;
    await Leaf.findOneAndUpdate(
      { _id: leafId },
      { $pull: { tasks: { _id: taskId } } }
    );
    return res.status(200).send({
      message: "Task Deleted",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { leafId, taskId, isDone, order } = req.body;
    await Leaf.findOneAndUpdate(
      { _id: leafId, "tasks._id": taskId },
      { $set: { "tasks.$.isDone": isDone, "tasks.$.order": order } }
    );
    return res.status(200).send({
      message: "Task Updated",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  createLeaf,
  deleteLeaf,
  addTask,
  deleteTask,
  updateTask,
  updateLeaf,
};
