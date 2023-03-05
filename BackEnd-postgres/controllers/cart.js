const pool = require("../db/db");

// DISPLAY CART ITEMS WITH CORRESPONDING USERS BY USERS.ID
const getCart = async (req, res) => {
  try {
    const cart = await pool.query(
      "SELECT users.email AS name, items.id AS itemid, items.name AS cart_item FROM users JOIN cart ON cart.users_id = users.id JOIN cart_items ON cart_items.cart_id = cart.id JOIN items ON items.id = cart_items.items_id WHERE users.id = $1",
      [req.body.id]
    );
    res.json(cart.rows);
  } catch (error) {
    console.log(error.message);
  }
};

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    // NEED TO OPTIMISE add to fav to prevent duplicates
    await pool.query(
      "INSERT INTO cart_items (cart_id, items_id) VALUES ($1, $2)",
      [req.body.emailId, req.body.itemId]
    );
    res.json("item added to cart");
  } catch (error) {
    console.log(error.message);
  }
};

// REMOVE CART ITEM
const removeCart = async (req, res) => {
  try {
    const cartItem = await pool.query(
      "SELECT * FROM cart_items WHERE cart_id = $1 AND items_id = $2",
      [req.body.emailId, req.body.itemId]
    );
    if (cartItem.rows[0]) {
      await pool.query(
        "DELETE FROM cart_items WHERE cart_id = $1 AND items_id = $2",
        [req.body.emailId, req.body.itemId]
      );
        return res.json("cart item successfully removed");
    //   res.json(favItem.rows);
    } 
    else {
      res.json("item not in favourite list");
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { getCart, addToCart, removeCart };
