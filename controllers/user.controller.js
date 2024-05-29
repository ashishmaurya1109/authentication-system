const { User }= require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  getUserById,
  getUserByEmail,
  createUser,
} = require("../services/user.service");

const register = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password)
        return res.status(400).json("Please Provide Necessary Details");
  
      const user = await createUser({name, email, password});
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "3d",
      });
  
      user.password = "";
  
      res.status(201).json({
        message: "Registered Successfully!",
        user,
        token,
      });
    } catch (error) {
      res.status(400).json(error);
    }
  }

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          status: "Login failed!",
          message: "Email and Password should not be empty",
        });
      }
  
      const user = await getUserByEmail(email)
      if (!user) {
        return res.status(404).json({
          message: "No email found!",
        });
      }
  
      const verify = await bcrypt.compare(password, user.password);
      if (!verify) {
        return res.status(400).json({
          message: "Password is Incorrect!",
        });
      }
  
      user.password = "";
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "24h",
      });

      res.status(200).json({
        status: "Login Successful!",
        user,
        token,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }

  const getAllUsers = async (req, res) => {
    try {
      const userId = req.userId;
      const user = await getUserById(userId);
      console.log("isUserAdmin" ,user);
  
      let users;
      if (!user.isAdmin) {
        users = await User.find({ isPublic: true }).select(
          "name email createdAt updatedAt phone"
        );
        return res.status(200).json(users);
      }
  
      users = await User.find().select("name email createdAt updatedAt phone");
  
      res.status(200).json(users);
    } catch (error) {
      console.log("Error -> ", error);
      res.status(400).json(error);
    }
  }

  const getProfile = async (req, res) => {
    try {
      const userId = req.userId;
  
      const user = getUserById(userId);
      if (!user) {
        return res.status(404).json({
          message: "Invalid User Id",
        });
      }
  
      user.password = "";
  
      res.status(200).json({
        status: "success",
        user,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }

  const editProfile = async (req, res) => {
    try {
      const userId = req.userId;
      const { profilePicture, name, bio, phone, email } = req.query;
      let updateObj = {};
      if (phone) updateObj.phone = phone;
      if (name) updateObj.name = name;
      if (bio) updateObj.bio = bio;
      if (email) updateObj.email = email;
      if (profilePicture) updateObj.profilePicture = profilePicture;
  
      const user = await User.findByIdAndUpdate(userId, updateObj, { new: true });
      if (!user) {
        return res.status(404).json({
          message: "User Not Found",
        });
      }
  
      user.password = "";
  
      res.status(200).json({
        status: "success",
        user,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }

  const changePassword = async (req, res) => {
    try {
      const userId = req.userId;
      const { oldPassword, newPassword } = req.query;
  
      const user = await getUserById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User Not Found",
        });
      }
      console.log("oldPassword", oldPassword);
      console.log("user.password", user.password);
      const verify = await bcrypt.compare(oldPassword, user.password);
      if (!verify) {
        return res.status(400).json({
          message: "Old Password is Incorrect!",
        });
      }
  
      const newHashPassword = await bcrypt.hash(newPassword, 10);
  
      const userDetail = await User.findByIdAndUpdate(
        userId,
        { password: newHashPassword },
        { new: true }
      );
  
      user.password = "";
  
      res.status(200).json({
        status: "success",
        userDetail,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }

  const changeVisibility = async (req, res) => {
    try {
      const userId = req.userId;
      const { isPublic, password } = req.query;
  
      const user = await getUserById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User Not Found",
        });
      }
      const verify = await bcrypt.compare(password, user.password);
      console.log("password", password);
      console.log("user.password", user.password);
      if (!verify) {
        return res.status(400).json({
          message: "Password is Incorrect!",
        });
      }

      const userDetail = await User.findByIdAndUpdate(
        userId,
        { isPublic: isPublic },
        { new: true }
      );
  
      user.password = "";
  
      res.status(200).json({
        status: "success",
        userDetail,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }

module.exports = {
  register,
  login,
  getAllUsers,
  getProfile,
  editProfile,
  changePassword,
  changeVisibility,
};
