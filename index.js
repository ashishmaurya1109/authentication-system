const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const UserRouter = require("./routes/user.route");

// Create an Express application
const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());

// Route
app.use("/users", UserRouter);

const PORT = process.env.PORT || 5000;

// Connect MongoDB database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    // Start server after database connection is successful
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    // Error for database connection failure
    console.log(`DB connection failed: ${error}`);
  });
