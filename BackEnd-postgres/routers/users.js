const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { newUser2 } = require("../controllers/restricted");

// POSTGRES
router.post("/newuser2", newUser2)

module.exports = router;
