const User = require("../models/userModel");
const Workplace = require("../models/workplaceModel");
const Branch = require("../models/branchModel");

const createWorkplace = async (req, res) => {
  try {
    const { workplaceName, description, branches } = req.body;
    const userId = req.userId;
    const { _id: workplaceId } = await Workplace.create({
      workplaceName,
      description,
      owner: userId,
      branches: [],
    });
  } catch (error) {}
};

const addMember = async (req, res) => {
  try {
    const { userId, workplaceId } = req.body;
    await Workplace.findOneAndUpdate(
      { _id: workplaceId, owner: req.userId },
      { $push: { members: userId } }
    );
    return res.status(200).send({
      message: "Member Added",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { userId, workplaceId } = req.body;
    await Workplace.findOneAndUpdate(
      { _id: workplaceId, owner: req.userId },
      { $pull: { members: userId } }
    );
    return res.status(200).send({
      message: "Member Removed",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  addMember,
  deleteMember,
};