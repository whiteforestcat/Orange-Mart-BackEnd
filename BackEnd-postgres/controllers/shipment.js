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
const deleteShipment = async (req, res) => {
  try {
    const shipment = await pool.query(
      "SELECT * FROM cart_shipment WHERE shipment_id = $1 AND cart_id = $2",
      [req.body.emailId, req.body.cartId]
    );
    if (shipment.rows[0]) {
      await pool.query(
        "DELETE FROM cart_shipment WHERE shipment_id = $1 AND cart_id = $2",
        [req.body.emailId, req.body.cartId]
      );
      return res.json("shipment cancelled");
      //   res.json(favItem.rows);
    } else {
      res.json("shipment does not exist");
    }
  } catch (error) {
    console.log(error.message);
  }
};



module.exports ={ addToShipment, getShipment, deleteShipment}