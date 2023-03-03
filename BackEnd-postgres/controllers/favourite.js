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

// DISPLAY ALL FAVOURITES ITEMS WITH CORRESPONDING USERS
const getFavourites = async (req, res) => {
  try {
    const favourites = await pool.query(
      "SELECT users.email as name, items.name as favs_item FROM users JOIN favs ON favs.users_id = users.id JOIN favs_items ON favs_items.favs_id = favs.id JOIN items ON items.id = favs_items.items_id"
    );
    res.json(favourites.rows);
  } catch (error) {
    console.log(error.message);
  }
};

// ADD TO FAVOURITES
const addToFavourites = async (req, res) => {
    try {
        await pool.query("INSERT INTO favs_items (favs_id, items_id) VALUES ($1, $2)",
        [req.body.emailId, req.body.itemId ])
        res.json("item added to favourites")
    } catch (error) {
        console.log(error.message)
    }
}

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
//   removeFavourites,
};
