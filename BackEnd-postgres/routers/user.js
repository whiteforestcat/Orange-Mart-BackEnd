const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  newUser,
  getUsers,
  targetUser,
  updateUser,
  deleteUser,
  seeding,
} = require("../controllers/user");

router.get("/allusers", getUsers);  // display all users
router.get("/seeding", seeding); // seeding data
router.get("/allusers/:id", targetUser);    // display specific user via params
router.put("/newuser", newUser);    // create new user
router.patch("/allusers/:id", updateUser);  // update user via params
router.delete("/deleteuser/:id", deleteUser);   // delete use via params

module.exports = router;
