const { User } = require("../models/user.model");
const bcrypt = require("bcryptjs");

const getUserById = async (id) => {
  const user = await User.findById(id); //findById is available by mongodb
  return user;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  return user;
};

const createUser = async (user) => {
  const emailExists = await User.findOne({ email: user.email });
  if (emailExists) {
    return res.status(400).json("Email already taken");
  }
  const salt = await bcrypt.genSalt();
  const hasedPassword = await bcrypt.hash(user.password, salt);
  const result = await User.create({ ...user, password: hasedPassword });
  return result;
};

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
};
