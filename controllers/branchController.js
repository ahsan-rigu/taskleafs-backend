const Branch = require("../models/branchModel");
const Workplace = require("../models/workplaceModel");

const createBranch = async (req, res) => {
  try {
    const { branch, workplaceId } = req.body;
    await Branch.create(branch);
    await Workplace.findOneAndUpdate(
      { _id: workplaceId, owner: req.userId },
      { $push: { branches: branch._id } }
    );
    return res.status(200).send({
      message: "Branch Created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

const deleteBranch = async (req, res) => {
  try {
    const { branchId, workplaceId } = req.params;
    console.log(branchId, workplaceId);
    const { leafs } = await Branch.findOneAndDelete({
      _id: branchId,
    });
    for (let j = 0; j < leafs.length; j++) {
      await Leaf.findOneAndDelete({ _id: leafs[j] });
    }

    await Workplace.findOneAndUpdate(
      { _id: workplaceId },
      { $pull: { branches: branchId } }
    );
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
    const { branchName, branchId } = req.body;
    await Branch.findOneAndUpdate({ _id: branchId }, { branchName });
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
