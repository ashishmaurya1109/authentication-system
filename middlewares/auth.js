const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      console.log("no-token", token);
      return res.status(400).json({
        status: "Fail",
        message: "Please provide token",
      });
    }

    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!verifiedUser) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid token",
      });
    }
    req.userId = verifiedUser.id;
    next();
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = authUser;
