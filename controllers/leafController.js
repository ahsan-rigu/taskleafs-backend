const Branch = require("../models/branchModel");
const Leaf = require("../models/leafModel");

const createLeaf = async (req, res) => {
  try {
    const { branchId, userId, leafName, order } = req.body;
    //rej if user not in members
    const leaf = await Leaf.create({ leafName, order });
    Branch.findOneAndUpdate({ _id: branchId }, { $push: { leafs: leaf._id } });
    return res.status(200).send({
      message: "Leaf Created",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const deleteLeaf = async (req, res) => {
  try {
    const { leafId, branchId, userId } = req.body;
    //rej if user not in members
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
