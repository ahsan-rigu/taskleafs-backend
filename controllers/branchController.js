const Branch = require("../models/branchModel");
const Leaf = require("../models/leafModel");
const Workplace = require("../models/workplaceModel");

const createBranch = async (req, res) => {
  try {
    const { branch, workplaceId } = req.body;
    await Branch.create(branch);
    const { name } = await Workplace.findOneAndUpdate(
      { _id: workplaceId },
      { $push: { branches: branch._id } }
    );
    for (let [id, socket] of req.io.of("/").sockets) {
      if (socket.workplaces.includes(workplaceId)) {
        socket.emit("change", {
          dispatch: {
            type: "ADD_BRANCH",
            payload: {
              branch: { ...branch, _id: branch._id.toString() },
              workplaceId,
            },
          },
          origin: req.userId,
          message: `Branch created by ${req.username} in "${name}"`,
        });
      }
    }
    return res.status(200).send({
      message: "Branch Created",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const deleteBranch = async (req, res) => {
  try {
    const { branchId, workplaceId } = req.params;
    const { leafs } = await Branch.findOneAndDelete({
      _id: branchId,
    });
    for (let j = 0; j < leafs.length; j++) {
      await Leaf.findOneAndDelete({ _id: leafs[j] });
    }
    const { name } = await Workplace.findOneAndUpdate(
      { _id: workplaceId },
      { $pull: { branches: branchId } }
    );
    for (let [id, socket] of req.io.of("/").sockets) {
      if (socket.workplaces.includes(workplaceId)) {
        socket.emit("change", {
          dispatch: {
            type: "DELETE_BRANCH",
            payload: { branchId, workplaceId },
          },
          origin: req.userId,
          message: `Branch deleted in "${name}" by ${req.username}`,
        });
      }
    }
    return res.status(200).send({
      message: "Branch Deleted",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const updateBranchName = async (req, res) => {
  try {
    const { branchName, branchId, workplaceName, workplaceId } = req.body;
    await Branch.findOneAndUpdate({ _id: branchId }, { branchName });
    for (let [id, socket] of req.io.of("/").sockets) {
      if (socket.workplaces.includes(workplaceId)) {
        socket.emit("change", {
          dispatch: {
            type: "UPDATE_BRANCH_NAME",
            payload: {
              branchName,
              branchId,
              workplaceId,
            },
          },
          origin: req.userId,
          message: `A Branch name has been changed in "${workplaceName}" by ${req.username}`,
        });
      }
    }
    return res.status(200).send({
      message: "Branch Updated",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  updateBranchName,
  deleteBranch,
  createBranch,
};
