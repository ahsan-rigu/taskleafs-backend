const User = require("../models/userModel");
const Workplace = require("../models/workplaceModel");

// User.watch().on("change", (change) => {
//   console.log(change);
// });

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
    console.log(user.workplaces);
    return res.status(200).send({
      message: "User Found",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  getUser,
};
