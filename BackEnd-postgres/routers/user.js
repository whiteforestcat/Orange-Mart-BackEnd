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
  logIn,
  refreshToken,
} = require("../controllers/user");
const { addToFavourites, getFavourites } = require("../controllers/favourite");

// USER ROUTES
router.post("/allusers", auth, getUsers); // display all users
router.get("/seed", seeding); // seeding data
router.get("/allusers/:id", targetUser); // display specific user via params
router.put("/newuser", newUser); // create new user
router.patch("/allusers/:id", updateUser); // update user via params
router.delete("/deleteuser/:id", deleteUser); // delete use via params
router.post("/login", logIn);
router.post("/refresh", refreshToken)

// FAVOURITES ROUTES
router.post("/addtofavourites", addToFavourites) // add item to favourites
router.get("/allfavourites", getFavourites) // display all favourites

module.exports = router;
