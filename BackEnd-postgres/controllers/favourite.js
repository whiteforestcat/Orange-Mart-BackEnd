const pool = require("../db/db");

// DISPLAY ALL FAVOURITES ITEMS
const getFavourites = async (req, res) => {
  try {
    const favourites = await pool.query("SELECT * FROM favourites");
    res.json(favourites.rows);
  } catch (error) {
    console.log(error.message);
  }
};

// ADD TO FAVOURITES
const addToFavourites = async (req, res) => {
  try {
    const existingItem = await pool.query(
      "SELECT * FROM favourites WHERE name = $1",
      [req.body.name]
    );
    console.log(existingItem.rows[0]);
    if (existingItem.rows[0]) {
      // can check for presence of object itself, no need to go deeper and use dot notation
      //   console.log("hello");
      //   console.log(existingUser.rows)
      return res.json({
        status: "error",
        message: "item already in favourites",
      });
    }
    const item = await pool.query(
      "INSERT into favourites (name, description, price) VALUES ($1, $2, $3)",
      [req.body.name, req.body.description, req.body.price]
    );
    res.json("item added to favourites");
  } catch (error) {
    console.log(error.message);
  }
};

// ADD TO FAVOURITES VIA PARAMS
const addToFavouritesV2 = async (req, res) => {
  try {
    await pool.query("UPDATE favourites SET ", [
      req.body.name,
      req.body.description,
      req.body.price,
    ]);
    res.json("item added to favourites");
  } catch (error) {
    console.log(error.message);
  }
};

// REMOVE FROM FAVOURITES
const removeFavourites = async (req, res) => {
  try {
    await pool.query("DELETE FROM favourites WHERE id = $1", [req.params.id]);
    res.json("favourite item successfully removed");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getFavourites,
  addToFavourites,
  addToFavouritesV2,
  removeFavourites,
};
