const User = require("../modules/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    return console.log(error);
  }

  if (!users) {
    return res.status(500).json({ message: "Internal Service Error" });
  }

  return res.status(200).json({ users });
};



module.exports = { getAllUsers};
