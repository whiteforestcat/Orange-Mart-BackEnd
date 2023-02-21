const express = require("express");
const router = express.Router();

const User = require("../models/User");
const auth = require("../middleware/auth");
const {
  getUsers,
  seeding,
  newUser,
  logIn,
  refreshToken,
} = require("../controllers/restricted");

router.get("/users", auth, getUsers);
router.get("/seed", seeding);
router.put("/newuser", newUser);
router.post("/login", logIn);
router.post("/refresh", refreshToken)

module.exports = router;
