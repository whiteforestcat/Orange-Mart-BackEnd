const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
const user = require("./routers/user")

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ROUTES

// CREATE NEW USER
// app.post("/newuser", async (req, res) => {
//   try {
//     const user = await pool.query(
//       "INSERT INTO user_accounts (email, password) VALUES($1, $2) RETURNING *",
//       [req.body.email, req.body.password]
//     );
//     // RETURNING * only for INSERT
//     res.json(user.rows[0]);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// DSIPLAY ALL USERS
// app.get("/allusers", async (req, res) => {
//   try {
//     const user = await pool.query("SELECT * FROM user_accounts");
//     res.json(user.rows);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // DISPLAY PARTICULAR USER USING PARAMS
// app.get("/allusers/:id", async (req, res) => {
//   try {
//     const user = await pool.query("SELECT * FROM user_accounts WHERE id = $1", [
//       req.params.id,
//     ]);
//     res.json(user.rows);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // UPDATE USER PROFILE
// app.patch("/allusers/:id", async (req, res) => {
//   try {
//     const update = await pool.query(
//       "UPDATE user_accounts SET email = $1, password = $2 WHERE id = $3",
//       [req.body.email, req.body.password, req.params.id]
//     );
//     res.json("User updated");
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// //DELETE USER
// app.delete("/deleteuser/:id", async (req, res) => {
//     try {
//         const remove = await pool.query("DELETE FROM user_accounts where id = $1", [req.params.id])
//         res.json("User Deleted")
//     }
//     catch (error) {
//         console.log(error.message)
//     }
// })

app.use("/api", user)

app.listen(5000, () => {
  console.log("server connected to PORT 5000");
});
