const express = require("express");
const router = express.Router();
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/createNewUser", async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, phone, bio, isAdmin, photo } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      // console.log(emailExists);
      return res.status(400).json("Email already Exists");
    }

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      phone,
      bio,
      isAdmin,
      photo,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "3d",
    });

    user.password = "";

    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    console.log("Error -> ", error);
    res.status(400).json(error);
  }
});

router.post("/userLogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Email and Password should not be empty",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Email is not registered!",
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
      status: "success",
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
