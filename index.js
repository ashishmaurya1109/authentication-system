const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const UserRouter = require("./routes/user.route");

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();
app.use(cors());

app.use(express.json());
// Mount the user routes at the /users endpoint
app.use("/users", UserRouter);

// Define the port to listen on, defaulting to 3005 if not provided in the environment
const PORT = process.env.PORT || 3005;

// Connect to the MongoDB database using the MONGO_URI from the environment variables
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB Connection Successfull");
    console.log("Node Environment :", process.env.NODE_ENV);
    // Start the Express server once the database connection is established
    app.listen(PORT, () => {
      console.log(`Server running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    // Log any errors that occur during the database connection process
    console.log("Error -> ", err.message);
  });
