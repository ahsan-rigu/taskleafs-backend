const User = require("../models/userModel");
const Workplace = require("../models/workplaceModel");
const Branch = require("../models/branchModel");

const createWorkplace = async (req, res) => {
  try {
    const { workplaceName, description } = req.body;
    const userId = req.userId;
    const { _id: workplaceId } = await Workplace.create({
      workplaceName,
      description,
      owner: userId,
      branches: [],
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const deleteWorkplace = async (req, res) => {
  try {
    const { workplaceId } = req.body;
    await Workplace.findOneAndDelete({
      _id: workplaceId,
      owner: req.userId,
    });
    return res.status(200).send({
      message: "Workplace Deleted",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const inviteUser = async (req, res) => {
  try {
    const { username, workplaceId } = req.body;
    User.findOneAndUpdate({
      username: username,
      invitations: { $ne: workplaceId },
    });
    return res.status(200).send({
      message: "User Invited",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

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
  createWorkplace,
  deleteWorkplace,
  addMember,
  deleteMember,
};
