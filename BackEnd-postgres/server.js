const express = require("express");
const cors = require("cors");
const pool = require("./db/db");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ROUTES

app.post("/newuser", async (req, res) => {
  try {
    const user = await pool.query(
      "INSERT INTO user_accounts (email, password) VALUES($1, $2)",
      [req.body.email, req.body.password]
    );
    res.json(user);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(5000, () => {
  console.log("server connected to PORT 5000");
});
