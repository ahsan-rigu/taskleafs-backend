const Branch = require("../models/branchModel");
const Leaf = require("../models/leafModel");

const createLeaf = async (req, res) => {
  try {
    const { branchId, leaf } = req.body;
    const { _id: newLeafId } = await Leaf.create(leaf);
    await Branch.findOneAndUpdate(
      { _id: branchId },
      { $push: { leafs: newLeafId } }
    );
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const deleteLeaf = async (req, res) => {
  try {
    const { leafId, branchId } = req.params;
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
    const { task, leafId } = req.body;
    await Leaf.findOneAndUpdate({ _id: leafId }, { $push: { tasks: task } });
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
    const { leafId, taskId } = req.params;
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
    const { task, leafId } = req.body;
    const leaf = await Leaf.findOne({ _id: leafId });
    const taskIndex = leaf.tasks.findIndex((t) => t._id == task._id);
    leaf.tasks[taskIndex] = task;
    await Leaf.findOneAndUpdate({ _id: leaf._id }, leaf);
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const moveTask = async (req, res) => {
  try {
    const { startLeaf, finishLeaf } = req.body;
    await Leaf.findOneAndUpdate({ _id: startLeaf._id }, startLeaf);
    await Leaf.findOneAndUpdate({ _id: finishLeaf._id }, finishLeaf);
    return res.status(200).send({
      message: "Task Moved",
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
  moveTask,
};
