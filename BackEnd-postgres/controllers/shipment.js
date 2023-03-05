const pool = require("../db/db")

// DISPLAY ALL TO SHIP ITEMS
const getShipment = async (req, res) => {
  try {
    const shipment = await pool.query(
      "SELECT users.email AS name, items.id AS itemid, items.name AS cart_item FROM users JOIN cart ON cart.users_id = users.id JOIN cart_items ON cart_items.cart_id = cart.id JOIN items ON items.id = cart_items.items_id JOIN cart_shipment ON cart_shipment.cart_id = cart.id JOIN shipment ON shipment.id = cart_shipment.shipment_id WHERE users.id = $1",
      [req.body.id]
    );
    res.json(shipment.rows);
  } catch (error) {
    console.log(error.message);
  }
};

// ADD TO SHIPPING LIST
const addToShipment = async (req, res) => {
  try {
    // NEED TO OPTIMISE add to fav to prevent duplicates
    await pool.query(
      "INSERT INTO cart_shipment (shipment_id, cart_id) VALUES ($1, $2)",
      [req.body.emailId, req.body.cartId]
    );
    res.json("item sent for shipment");
  } catch (error) {
    console.log(error.message);
  }
};

// DELETE FROM SHIPPING LIST (IE CANCEL ORDER)




module.exports ={ addToShipment, getShipment}