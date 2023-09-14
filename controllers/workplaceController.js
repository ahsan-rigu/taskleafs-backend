const User = require("../models/userModel");
const Workplace = require("../models/workplaceModel");
const Branch = require("../models/branchModel");
const Leaf = require("../models/leafModel");

const createWorkplace = async (req, res) => {
  try {
    const { name: workplaceName, description } = req.body;
    const userId = req.userId;
    const { name, username } = await User.findOne({ _id: userId });
    const workplace = await Workplace.create({
      name: workplaceName,
      description,
      owner: userId,
      members: [{ _id: userId, name: name, username: username }],
      branches: [],
    });
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { workplaces: workplace._id } }
    );
    for (let [id, socket] of req.io.of("/").sockets) {
      if (socket.userId === userId) {
        socket.workplaces.push(workplace._id.toString());
      }
    }
    return res.status(201).send({
      message: "Workplace Created",
      workplace,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const updateWorkplace = async (req, res) => {
  try {
    const { workplaceId, workplaceName, description } = req.body;
    await Workplace.findOneAndUpdate(
      { _id: workplaceId, owner: req.userId },
      { name: workplaceName, description }
    );
    for (let [id, socket] of req.io.of("/").sockets) {
      if (socket.workplaces.includes(workplaceId)) {
        socket.emit("change", {
          dispatch: {
            type: "EDIT_WORKPLACE",
            payload: { name: workplaceName, description, workplaceId },
          },
          origin: req.userId,
          message: `Workplace details of "${workplaceName}" updated by ${req.username}`,
        });
      }
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const deleteWorkplace = async (req, res) => {
  try {
    const { workplaceId } = req.params;
    const workplace = await Workplace.findOneAndDelete({
      _id: workplaceId,
      owner: req.userId,
    });
    const branches = workplace.branches;
    for (let i = 0; i < branches.length; i++) {
      const branch = await Branch.findOneAndDelete({ _id: branches[i] });
      const leafs = branch.leafs;
      for (let j = 0; j < leafs.length; j++) {
        await Leaf.findOneAndDelete({ _id: leafs[j] });
      }
    }
    const user = await User.find();
    for (let i = 0; i < user.length; i++) {
      const workplaces = user[i].workplaces;
      for (let j = 0; j < workplaces.length; j++) {
        if (workplaces[j] === workplaceId) {
          User.findOneAndUpdate(
            { _id: user[i]._id },
            { $pull: { workplaces: workplaceId } }
          );
        }
      }
    }
    for (let [id, socket] of req.io.of("/").sockets) {
      if (socket.workplaces.includes(workplaceId)) {
        socket.emit("change", {
          dispatch: {
            type: "DELETE_WORKPLACE",
            payload: { workplaceId },
          },
          origin: req.userId,
          message: `Wrokplace "${workplace.name}" has been deleted by ${req.username}`,
        });
      }
    }
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
    const workplace = await Workplace.findOne({ _id: workplaceId });
    if (workplace.owner.toString() !== req.userId) {
      return res.status(401).send({
        message: "You are not the owner of this workplace",
      });
    }
    if (workplace.members.find((member) => member.username === username)) {
      return res.status(401).send({
        message: "User is already a member of this workplace",
      });
    }
    await User.findOneAndUpdate(
      {
        username: username,
      },
      {
        $pull: {
          invitations: {
            workplaceId: workplaceId,
            name: workplace.name,
          },
        },
      }
    );
    const { _id } = await User.findOneAndUpdate(
      {
        username: username,
      },
      {
        $push: {
          invitations: {
            workplaceId: workplaceId,
            name: workplace.name,
          },
        },
      }
    );
    for (let [id, socket] of req.io.of("/").sockets) {
      if (socket.userId === _id.toString()) {
        socket.emit("change", {
          dispatch: {
            type: "INVITE",
            payload: {
              workplaceId: workplaceId,
              name: workplace.name,
            },
          },
          origin: req.userId,
          message: `You have been invited to "${workplace.name}" by ${req.username}`,
        });
      }
    }
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
    const { workplaceId, workplaceName } = req.body;
    const { name, username } = await User.findOneAndUpdate(
      { _id: req.userId },
      {
        $push: {
          workplaces: workplaceId,
        },
        $pull: {
          invitations: { workplaceId: workplaceId, name: workplaceName },
        },
      }
    );
    const workplace = await Workplace.findOneAndUpdate(
      { _id: workplaceId },
      {
        $push: {
          members: {
            _id: req.userId,
            name,
            username,
          },
        },
      }
    ).populate({
      path: "branches",
      populate: { path: "leafs" },
    });
    for (let [id, socket] of req.io.of("/").sockets) {
      if (socket.workplaces.includes(workplaceId)) {
        socket.emit("change", {
          dispatch: {
            type: "ADD_MEMBER",
            payload: {
              workplaceId: workplaceId,
              member: { _id: req.userId, username, name },
            },
          },
          origin: req.userId,
          message: `${name} has been added to "${workplace.name}" by ${req.username}`,
        });
      }
      if (socket.userId === req.userId) {
        socket.workplaces.push(workplaceId);
      }
    }
    return res.status(200).send({
      workplace,
      message: "You have been added to the workplace",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const deleteInvite = async (req, res) => {
  try {
    const { workplaceId, workplaceName } = req.body;
    await User.findOneAndUpdate(
      { _id: req.userId },
      {
        $pull: {
          invitations: { workplaceId: workplaceId, name: workplaceName },
        },
      }
    );
    return res.status(200).send({
      message: "Invite Deleted",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { workplaceId, removeUserId } = req.params;
    const { userId } = req;
    const { owner } = await Workplace.findOne({ _id: workplaceId });
    if (owner.toString() === removeUserId) {
      return res.status(401).send({
        message:
          "Owner cannot be removed from workplace, Delete Workplace instead",
      });
    }
    if (userId === removeUserId || userId === owner.toString()) {
      const { name, username } = await User.findOneAndUpdate(
        { _id: removeUserId },
        {
          $pull: {
            workplaces: workplaceId,
          },
        }
      );
      const workplace = await Workplace.findOneAndUpdate(
        { _id: workplaceId },
        { $pull: { members: { _id: removeUserId, name, username } } }
      );
      for (let [id, socket] of req.io.of("/").sockets) {
        if (socket.userId === removeUserId) {
          socket.workplaces = socket.workplaces.filter(
            (workplace) => workplace !== workplaceId
          );
          socket.emit("change", {
            dispatch: {
              type: "DELETE_MEMBER",
              payload: {
                workplaceId,
              },
            },
            origin: req.userId,
            message: `You have been removed from "${workplace.name}" by ${req.username}`,
          });
        }
      }
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
  changeOwner,
  updateWorkplace,
  deleteInvite,
};
