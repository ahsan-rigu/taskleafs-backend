const Branch = require("../models/branchModel");
const Workplace = require("../models/workplaceModel");

const createBranch = async (req, res) => {
  try {
    const { branchName, description, workplaceId } = req.body;
    const { _id: branchId } = await Branch.create({
      branchName,
      description,
      workplaceId,
      leaves: [],
    });
    await Workplace.findOneAndUpdate(
      { _id: workplaceId, owner: req.userId },
      { $push: { branches: branchId } }
    );
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
    const { branchId } = req.body;
    await Branch.findOneAndDelete({
      _id: branchId,
      owner: req.userId,
    });
    return res.status(200).send({
      message: "Branch Deleted",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  deleteBranch,
  createBranch,
};
