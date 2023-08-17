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
    const { username, workplaceId, userId } = req.body;
    const { owner } = await Workplace.find({ _id: workplaceId });
    if (owner !== req.userId) {
      return res.status(401).send({
        message: "You are not the owner of this workplace",
      });
    }
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
    const { userId, workplaceId, removeUserId } = req.body;
    const { owner } = await Workplace.findOne({ _id: workplaceId });
    if (owner === removeUserId) {
      return res.status(401).send({
        message:
          "Owner cannot be removed from workplace, Delete Workplace instead",
      });
    }
    if (userId === removeUserId || userId === owner) {
      await Workplace.findOneAndUpdate(
        { _id: workplaceId },
        { $pull: { members: userId } }
      );
      return res.status(200).send({
        message: "Member Removed",
      });
    } else {
      return res.status(401).send({
        message: "You are not authorized to remove this member",
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const changeOwner = async (req, res) => {
  try {
    const { userId, workplaceId, newOwner } = req.body;
    const { owner } = await Workplace.findOne({ _id: workplaceId });
    if (owner !== userId) {
      return res.status(401).send({
        message: "You are not authorized to change the owner",
      });
    }
    await Workplace.findOneAndUpdate({ _id: workplaceId }, { owner: newOwner });
    return res.status(200).send({
      message: "Owner Changed",
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
  inviteUser,
  addMember,
  deleteMember,
};
