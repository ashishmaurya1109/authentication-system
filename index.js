require("dotenv").config();

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  console.log("request reached");
  res.status(200).send(`<h1>Hello World</h1>`);
});

const hostname= process.env.HOST_NAME
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running at ${hostname}${port}`);
});
