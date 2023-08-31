const User = require("../models/userModel");

const getUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findOne({ _id: userId }).populate({
      path: "workplaces",
      populate: {
        path: "branches",
        populate: { path: "leafs" },
      },
    });
    user.password = undefined;
    return res.status(200).send({
      message: "User Found",
      user,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  getUser,
};
