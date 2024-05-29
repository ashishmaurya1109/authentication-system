const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/auth.js");

const {
  register,
  login,
  getAllUsers,
  getProfile,
  editProfile,
  changePassword,
  changeVisibility,
} = require("../controllers/user.controller.js");

// Endpoint to register new user
router.post("/register", register);

// Endpoint to login existing user
router.post("/login", login);

// Endpoint to get all users
router.get("/getAllUsers", authUser, getAllUsers);

// Endpoint to get profile of the user logged in
router.get("/getProfile", authUser, getProfile);

// Endpoint to edit the profile details of the user logged in
router.patch("/editProfile", authUser, editProfile);

// Endpoint to change the password of the user logged in
router.patch("/changePassword", authUser, changePassword);

// Endpoint to change public profile to private and private to public of the user logged in
router.patch("/changeVisibility", authUser, changeVisibility);

module.exports = router;
