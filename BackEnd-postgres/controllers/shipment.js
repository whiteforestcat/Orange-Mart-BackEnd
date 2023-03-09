const pool = require("../db/db");
let storeShipment = []; // if server is down, data will be lost

// DISPLAY ALL TO SHIP ITEMS
const getShipment = async (req, res) => {
  try {
    const shipment = await pool.query(
      "SELECT users.email AS name, cart.id AS cartid, items.name AS cart_item, items.id AS itemid FROM users JOIN cart ON cart.users_id = users.id JOIN cart_items ON cart_items.cart_id = cart.id JOIN items ON items.id = cart_items.items_id JOIN cart_shipment ON cart_shipment.cart_id = cart.id JOIN shipment ON shipment.id = cart_shipment.shipment_id WHERE users.id = $1",
      [req.body.id]
    );
    // const storeShipment = []; // cannot declare storeShipment here as it will keep re-initialising when endpoint to [] is called
    for (let i = 0; i < shipment.rows.length; i++) {
      storeShipment.push(shipment.rows[i]);
    }
    console.log(storeShipment);
    // storeShipment.push()
    await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [
      req.body.id,
    ]);
    console.log(storeShipment);

    res.json(storeShipment); // this will combine and display all user's shipment list, need to filter in FE
  } catch (error) {
    console.log(error.message);
  }
};

// ADD TO SHIPPING LIST
const addToShipment = async (req, res) => {
  try {
    const existingShipment = await pool.query(
      "SELECT shipment_id, cart_id FROM cart_shipment WHERE shipment_id = $1 AND cart_id = $2",
      [req.body.shipmentId, req.body.cartId]
    );
    // console.log(existingFav)
    if (existingShipment.rows[0]) {
      return res.json("cart already in shipment");
    }
    const newShipment = await pool.query(
      "INSERT INTO cart_shipment (shipment_id, cart_id) VALUES ($1, $2)",
      [req.body.emailId, req.body.cartId]
    );
    // await pool.query(
    //   "DELETE FROM cart_items WHERE cart_id = $1",
    //   [req.body.cartId]
    // )
    res.json("item sent for shipment");
  } catch (error) {
    console.log(error.message);
  }
};

// DELETE FROM SHIPPING LIST (IE CANCEL ORDER)
const deleteShipment = async (req, res) => {
  console.log(storeShipment);
  let postShipment = storeShipment.filter((item) => {
    return item.cartid === req.body.cartId;
  });
  let test = storeShipment.filter((item) => {
    return item.cartid !== req.body.cartId;
  });
  storeShipment.length = 0; // clears array
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
      // let postShipment = storeShipment.filter((item) => item.id !== req.body.cartId)
      // console.log(storeShipment)
      return res.json({
        status: "shipment cancelled",
        postShipment: postShipment,
        test,
      });
      //   res.json(favItem.rows);
    } else {
      res.json("shipment does not exist");
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { addToShipment, getShipment, deleteShipment };
