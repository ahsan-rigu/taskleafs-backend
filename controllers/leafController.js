const Branch = require("../models/branchModel");
const Leaf = require("../models/leafModel");

const createLeaf = async (req, res) => {
  try {
    const { branchId, leaf, workplaceId } = req.body;
    const { _id: newLeafId } = await Leaf.create(leaf);
    await Branch.findOneAndUpdate(
      { _id: branchId },
      { $push: { leafs: newLeafId } }
    );
    for (let [id, socket] of req.io.of("/").sockets) {
      if (socket.workplaces.includes(workplaceId)) {
        socket.emit("change", {
          dispatch: {
            type: "ADD_LEAF",
            payload: { branchId, leaf: { ...leaf, _id: leaf._id.toString() } },
          },
          origin: req.userId,
          message: `Leaf "${leaf.leafName}" created by ${req.username}`,
        });
      }
    }
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const deleteLeaf = async (req, res) => {
  try {
    const { leafId, branchId, workplaceId } = req.params;
    await Leaf.deleteOne({ _id: leafId });
    await Branch.findOneAndUpdate(
      { _id: branchId },
      { $pull: { leafs: leafId } }
    );
    for (let [id, socket] of req.io.of("/").sockets) {
      if (socket.workplaces.includes(workplaceId)) {
        socket.emit("change", {
          dispatch: {
            type: "DELETE_LEAF",
            payload: { leafId, branchId, workplaceId },
          },
          origin: req.userId,
          message: `Leaf deleted by ${req.username}`,
        });
      }
    }

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
    const { _id, leafName, dispatchObj, workplaceId } = req.body;
    await Leaf.findOneAndUpdate({ _id }, { leafName });
    for (let [id, socket] of req.io.of("/").sockets) {
      if (socket.workplaces.includes(workplaceId)) {
        socket.emit("change", {
          dispatch: dispatchObj,
          origin: req.userId,
          message: `Leaf name changed by ${req.username}`,
        });
      }
    }
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
    const { task, leafId, branchId, workplaceId } = req.body;
    await Leaf.findOneAndUpdate({ _id: leafId }, { $push: { tasks: task } });
    for (let [id, socket] of req.io.of("/").sockets) {
      if (socket.workplaces.includes(workplaceId)) {
        socket.emit("change", {
          dispatch: {
            type: "ADD_TASK",
            payload: { leafId, task, branchId, workplaceId },
          },
          origin: req.userId,
          message: `Task "${task.task}" created by ${req.username}`,
        });
      }
    }
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
    const { leafId, taskId, workplaceId, branchId } = req.params;
    await Leaf.findOneAndUpdate(
      { _id: leafId },
      { $pull: { tasks: { _id: taskId } } }
    );
    for (let [id, socket] of req.io.of("/").sockets) {
      if (socket.workplaces.includes(workplaceId)) {
        socket.emit("change", {
          dispatch: {
            type: "DELETE_TASK",
            payload: { leafId, taskId, branchId, workplaceId },
          },
          origin: req.userId,
          message: `Task deleted by ${req.username}`,
        });
      }
    }
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
    const { task, leafId, branchId, workplaceId } = req.body;
    const leaf = await Leaf.findOne({ _id: leafId });
    const taskIndex = leaf.tasks.findIndex((t) => t._id == task._id);
    leaf.tasks[taskIndex] = task;
    await Leaf.findOneAndUpdate({ _id: leaf._id }, leaf);
    for (let [id, socket] of req.io.of("/").sockets) {
      if (socket.workplaces.includes(workplaceId)) {
        socket.emit("change", {
          dispatch: {
            type: "EDIT_TASK_PRIORITY",
            payload: {
              leafId,
              taskId: task._id,
              branchId,
              workplaceId,
              priority: task.priority,
            },
          },
          origin: req.userId,
          message: `Task priority changed by ${req.username}`,
        });
      }
    }
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const moveTask = async (req, res) => {
  try {
    const {
      workplaceId,
      branchId,
      startLeafId,
      finishLeafId,
      source,
      destination,
    } = req.body;

    const { tasks } = await Leaf.findOne({ _id: startLeafId });
    const task = tasks.splice(source.index, 1)[0];
    await Leaf.findOneAndUpdate({ _id: startLeafId }, { tasks });
    const finishLeaf = await Leaf.findOne({ _id: finishLeafId });
    finishLeaf.tasks.splice(destination.index, 0, task);
    await Leaf.findOneAndUpdate({ _id: finishLeafId }, finishLeaf);
    for (let [id, socket] of req.io.of("/").sockets) {
      if (socket.workplaces.includes(workplaceId)) {
        socket.emit("change", {
          dispatch: {
            type: "MOVE_TASK",
            payload: {
              startLeafId,
              finishLeafId,
              source,
              destination,
              branchId,
              workplaceId,
            },
          },
          origin: req.userId,
          message: `Task moved by ${req.username}`,
        });
      }
    }
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
