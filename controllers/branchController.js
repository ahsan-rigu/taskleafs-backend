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

module.exports = {
  createBranch,
};
