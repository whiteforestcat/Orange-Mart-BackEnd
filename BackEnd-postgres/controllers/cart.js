const pool = require("../db/db")

// DISPLAY CART ITEMS WITH CORRESPONDING USERS BY USERS.ID
const getCart = async (req, res) => {
  try {
    const favourites = await pool.query(
      "SELECT users.email AS name, items.id AS itemid, items.name AS favs_item FROM users JOIN favs ON favs.users_id = users.id JOIN favs_items ON favs_items.favs_id = favs.id JOIN items ON items.id = favs_items.items_id WHERE users.id = $1",
      [req.body.id]
    );
    res.json(favourites.rows);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {}