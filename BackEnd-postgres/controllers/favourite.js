const pool = require("../db/db");

// DISPLAY ALL FAVOURITES ITEMS
// const getFavourites = async (req, res) => {
//   try {
//     const favourites = await pool.query("SELECT * FROM favourites");
//     // USE THE UPDATED SQL COMMAND, CHANGE THE ABOVE
//     res.json(favourites.rows);
//     // THIS WILL DISPLAY ALL ACCOUNTS WITH THEIR FAVOURITE ITEMS
//     // USE ARRAY.FILTER() TO FILTER OUT ONLY BY PAYLOAD.EMAIL SO THAT ONLY THAT USER'S FAVOURITES WILL SHOW
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// DISPLAY ALL FAVOURITES ITEMS WITH CORRESPONDING USERS BY USERS.ID
const getFavourites = async (req, res) => {
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

// ADD TO FAVOURITES
const addToFavourites = async (req, res) => {
  try {
    // NEED TO OPTIMISE add to fav to prevent duplicates
    const existingFav = await pool.query(
      "SELECT favs_id, items_id FROM favs_items WHERE favs_id = $1 AND items_id = $2",
      [req.body.favsId, req.body.itemId]
    )
      console.log(existingFav)
    if (existingFav.rows[0]) {
      return res.json("item already in favourites")
    }

    await pool.query(
      "INSERT INTO favs_items (favs_id, items_id) VALUES ($1, $2)",
      [req.body.emailId, req.body.itemId]
    );
    res.json("item added to favourites");
  } catch (error) {
    console.log(error.message);
  }
};

// REMOVE FAVOURITES
const removeFavourites = async (req, res) => {
  try {
    const favItem = await pool.query(
      "SELECT * FROM favs_items WHERE favs_id = $1 AND items_id = $2",
      [req.body.emailId, req.body.itemId]
    );
    if (favItem.rows[0]) {
      await pool.query(
        "DELETE FROM favs_items WHERE favs_id = $1 AND items_id = $2",
        [req.body.emailId, req.body.itemId]
      );
        return res.json("favourite item successfully removed");
    //   res.json(favItem.rows);
    } 
    else {
      res.json("item not in favourite list");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// // ADD TO FAVOURITES
// const addToFavourites = async (req, res) => {
//   try {
//     const existingItem = await pool.query(
//       "SELECT * FROM favs WHERE name = $1",
//       [req.body.name]
//     );
//     console.log(existingItem.rows[0]);
//     if (existingItem.rows[0]) {
//       // can check for presence of object itself, no need to go deeper and use dot notation
//       //   console.log("hello");
//       //   console.log(existingUser.rows)
//       return res.json({
//         status: "error",
//         message: "item already in favourites",
//       });
//     }
//     const item = await pool.query(
//       "INSERT into favs (name, description, price) VALUES ($1, $2, $3)",
//       [req.body.name, req.body.description, req.body.price]
//     );
//     res.json("item added to favourites");
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// // ADD TO FAVOURITES VIA PARAMS
// const addToFavouritesV2 = async (req, res) => {
//   try {
//     await pool.query("UPDATE favourites SET ", [
//       req.body.name,
//       req.body.description,
//       req.body.price,
//     ]);
//     res.json("item added to favourites");
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// // REMOVE FROM FAVOURITES
// const removeFavourites = async (req, res) => {
//   try {
//     await pool.query("DELETE FROM favourites WHERE id = $1", [req.params.id]);
//     res.json("favourite item successfully removed");
//   } catch (error) {
//     console.log(error.message);
//   }
// };

module.exports = {
  getFavourites,
  addToFavourites,
  //   addToFavouritesV2,
  removeFavourites,
};
