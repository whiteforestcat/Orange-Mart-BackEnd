const pool = require("../db/db");

// DISPLAY CART ITEMS WITH CORRESPONDING USERS BY USERS.ID
const getCart = async (req, res) => {
  try {
    const cart = await pool.query(
      "SELECT users.email AS name, items.id AS itemid, cart_items.quantity, cart.id AS cartid, items.name AS cart_item FROM users JOIN cart ON cart.users_id = users.id JOIN cart_items ON cart_items.cart_id = cart.id JOIN items ON items.id = cart_items.items_id WHERE users.id = $1",
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
      "INSERT INTO cart_items (cart_id, items_id, quantity) VALUES ($1, $2, $3)",
      [req.body.emailId, req.body.itemId, req.body.quantity]
    );
    const stock = await pool.query("SELECT stock FROM items WHERE id = $1", [
      req.body.itemId,
    ]);
    console.log("current stock", stock.rows[0].stock);
    await pool.query("UPDATE items SET stock = $1 WHERE id = $2", [
      stock.rows[0].stock - req.body.quantity,
      req.body.itemId,
    ]);
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
    //   await pool.query(
    //     "UPDATE items SET stock = "
    //   )
      return res.json("cart item successfully removed");
      //   res.json(favItem.rows);
    } else {
      res.json("item not in cart");
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { getCart, addToCart, removeCart };
