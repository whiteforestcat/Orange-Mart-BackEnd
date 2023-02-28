const pool = require("../db/db");

// DSIPLAY ALL USERS
const getUsers = async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM user_accounts");
    res.json(user.rows);
  } catch (error) {
    console.log(error.message);
  }
};

// SEEDING INITAL DATA
const seeding = async (req, res) => {
  try {
    await pool.query("DELETE FROM user_accounts");
    await pool.query(
      "INSERT INTO user_accounts(email, password, admin) VALUES ($1, $2, $3) RETURNING *",
      ["mrmuhdamir@gmail.com", "92344590", true]
    );
    await pool.query(
      "INSERT INTO user_accounts(email, password) VALUES ($1, $2) RETURNING *",
      ["test@gmail.com", "123456789"]
    );
    await pool.query(
      "INSERT INTO user_accounts(email, password) VALUES ($1, $2) RETURNING *",
      ["hello@gmail.com", "123456789"]
    );
    await pool.query(
      "INSERT INTO user_accounts(email, password) VALUES ($1, $2) RETURNING *",
      ["bye@gmail.com", "123456789"]
    );
    await pool.query(
      "INSERT INTO user_accounts(email, password) VALUES ($1, $2) RETURNING *",
      ["world@gmail.com", "123456789"]
    );
    res.json("seeding successful");
  } catch (error) {
    console.log("ERROR seeding unsuccessful", error.message);
  }
};

// DISPLAY PARTICULAR USER USING PARAMS
const targetUser = async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM user_accounts WHERE id = $1", [
      req.params.id,
    ]);
    res.json(user.rows);
  } catch (error) {
    console.log(error.message);
  }
};

// CREATE NEW USERS
const newUser = async (req, res) => {
  try {
    const user = await pool.query(
      "INSERT INTO user_accounts (email, password) VALUES($1, $2) RETURNING *",
      [req.body.email, req.body.password]
    );
    // RETURNING * only for INSERT
    res.json(user.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
};

// UPDATE USER PROFILE
const updateUser = async (req, res) => {
  try {
    await pool.query(
      "UPDATE user_accounts SET email = $1, password = $2 WHERE id = $3",
      [req.body.email, req.body.password, req.params.id]
    );
    res.json("User updated");
  } catch (error) {
    console.log(error.message);
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    await pool.query("DELETE FROM user_accounts where id = $1", [
      req.params.id,
    ]);
    res.json("User Deleted");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  newUser,
  getUsers,
  targetUser,
  updateUser,
  deleteUser,
  seeding,
};
