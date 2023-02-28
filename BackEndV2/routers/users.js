const express = require("express");
const router = express.Router();

// const User = require("../models/User");
const auth = require("../middleware/auth");
const {
  getUsers,
  seeding,
  newUser,
  logIn,
  refreshToken,
} = require("../controllers/restricted");
const { createMessage, seedMessage, getMessage } = require("../controllers/message");

router.post("/users", auth, getUsers);
router.get("/seed", seeding);
router.put("/newuser", newUser);
router.post("/login", logIn);
router.post("/refresh", refreshToken)

router.put("/createmessage", auth, createMessage)
router.get("/seedmessage", seedMessage)
router.post("/findmessage", getMessage)

module.exports = router;
