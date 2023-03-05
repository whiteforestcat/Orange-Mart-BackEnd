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
const {
  addToFavourites,
  getFavourites,
  removeFavourites,
} = require("../controllers/favourite");
const { allItems } = require("../controllers/gallery");
const { addToCart, getCart } = require("../controllers/cart");

// USER ROUTES
router.post("/allusers", auth, getUsers); // display all users
router.get("/seed", seeding); // seeding data
router.get("/allusers/:id", targetUser); // display specific user via params
router.put("/newuser", newUser); // create new user
router.patch("/allusers/:id", updateUser); // update user via params
router.delete("/deleteuser/:id", deleteUser); // delete use via params
router.post("/login", logIn);
router.post("/refresh", refreshToken);

// GALLERY
router.get("/allitems", allItems); // display all items to sell

// FAVOURITES ROUTES
router.post("/addtofavourites", addToFavourites); // add item to favourites
router.post("/allfavourites", getFavourites); // display all favourites
router.delete("/deletefav", removeFavourites); // delete favourites

// CART ROUTES
router.post("/addtocart", addToCart); // add item to cart
router.post("/allcart", getCart); // display all items in cart

module.exports = router;
