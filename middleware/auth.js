require("dotenv").config();

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers["authorization"].replace("Bearer ", "");
  console.log("auth is used here")

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      req.decoded = decoded;
      next();
    } catch (error) {
      return res.json({ status: "error", message: "invalid auhtorization" });
    }
  } else {
    return res.json({
      status: "error",
      message: "missing token",
    });
  }
};

module.exports = auth;
