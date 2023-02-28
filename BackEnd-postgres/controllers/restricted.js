const pool = require("../db/db");

// SHOW ALL USERS POSTGRES
const newUser2 = async (req, res) => {
  try {
    const user = await pool.query(
      "INSERT INTO user_accounts (email) VALUES($1)",
      [req.body.email]
    );
    res.json(user);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {newUser2}