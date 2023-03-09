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
const {
  addToCart,
  getCart,
  removeCart,
  updateCart,
} = require("../controllers/cart");
const {
  addToShipment,
  getShipment,
  deleteShipment,
} = require("../controllers/shipment");

// USER ROUTES
router.post("/allusers", auth, getUsers); // display all users
router.get("/seed", seeding); // seeding data
router.get("/allusers/:id", targetUser); // display specific user via params
router.put("/newuser", newUser); // create new user
router.patch("/allusers/:id", auth, updateUser); // update user via params
router.delete("/deleteuser/:id", deleteUser); // delete use via params
router.post("/login", logIn);
router.post("/refresh", refreshToken);

// GALLERY
router.get("/allitems", allItems); // display all items to sell

// FAVOURITES ROUTES
router.post("/addtofavourites", auth, addToFavourites); // add item to favourites
router.post("/allfavourites", auth, getFavourites); // display all favourites
router.delete("/deletefav", auth, removeFavourites); // delete favourites

// CART ROUTES
router.post("/addtocart", auth, addToCart); // add item to cart
router.post("/allcart", auth, getCart); // display all items in cart
router.delete("/deletecart", auth, removeCart); // delete cart item
router.patch("/updatecart", auth, updateCart); // update cart quantity

// SHIPMENT ROUTES
router.post("/addtoshipment", auth, addToShipment);
router.post("/allshipment", auth, getShipment);
router.delete("/deleteshipment", auth, deleteShipment);

module.exports = router;
