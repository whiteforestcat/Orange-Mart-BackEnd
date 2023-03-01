const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// DSIPLAY ALL USERS
const getUsers = async (req, res) => {
  try {
    const existingUser = await pool.query(
      "SELECT * FROM user_accounts WHERE email = $1",
      [req.body.email]
    );
    // res.json(existingUser.rows[0])
    if (existingUser.rows[0].admin === true) {
      console.log("granted admin access");
      const user = await pool.query("SELECT * FROM user_accounts");
      res.json(user.rows);
    } else {
      res.json({ status: "error", message: "user has no admin rights" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const test = "hello";
async function hasher(raw) {
  const res = await bcrypt.hash(raw, 12);
  return JSON.stringify(res);
}

// SEEDING INITAL DATA
const seeding = async (req, res) => {
  try {
    await pool.query("DELETE FROM user_accounts");
    await pool.query(
      "INSERT INTO user_accounts(email, hash, admin) VALUES ($1, $2, $3) RETURNING *",
      ["mrmuhdamir@gmail.com", "92344590", true]
    );
    await pool.query(
      "INSERT INTO user_accounts(email, hash) VALUES ($1, $2) RETURNING *",
      ["test@gmail.com", "123456789"]
    );
    await pool.query(
      "INSERT INTO user_accounts(email, hash) VALUES ($1, $2) RETURNING *",
      ["hello@gmail.com", "123456789"]
    );
    await pool.query(
      "INSERT INTO user_accounts(email, hash) VALUES ($1, $2) RETURNING *",
      ["bye@gmail.com", "123456789"]
    );
    await pool.query(
      "INSERT INTO user_accounts(email, hash) VALUES ($1, $2) RETURNING *",
      ["world@gmail.com", "123456789"]
    );
    const users = await pool.query("SELECT * FROM user_accounts");
    // res.json(user.rows);
    users.rows.map(async (user, index) => {
        const encrypted = await bcrypt.hash(user.hash, 12)
        await pool.query("UPDATE user_accounts SET hash =$1 WHERE id = $2", [encrypted, index + 1])
        console.log(user.hash)
        console.log(encrypted)
    })
    res.json("seeding successful");
  } catch (error) {
    console.log("ERROR seeding unsuccessful", error.message);
  }
};

// DISPLAY PARTICULAR USER USING PARAMS (SEARCH BY ID)
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

// CREATE NEW USER
const newUser = async (req, res) => {
  try {
    const existingUser = await pool.query(
      "SELECT email FROM user_accounts WHERE email = $1",
      [req.body.email]
    );
    if (existingUser.rows[0]) {
      console.log("hello");
      //   console.log(existingUser.rows)
      return res.json({ status: "error", message: "duplicate email" });
    }
    // res.json(existingUser.rows[0]);
    const hash = await bcrypt.hash(req.body.hash, 12);
    const user = await pool.query(
      "INSERT INTO user_accounts (email, hash, admin) VALUES($1, $2, $3) RETURNING *",
      [req.body.email, hash, req.body.admin]
    );
    // RETURNING * only for INSERT
    res.json(user.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
};

// LOGGING IN
const logIn = async (req, res) => {
  try {
    const existingUser = await pool.query(
      "SELECT * FROM user_accounts WHERE email = $1",
      [req.body.email]
    );
    // res.json(existingUser.rows[0].email);

    // CHECKING IF EMAIL EXISTS
    if (!existingUser.rows[0]) {
      return res.json({
        status: "error",
        message: "email does not exist",
      });
    }
    const result = await bcrypt.compare(
      req.body.hash,
      existingUser.rows[0].hash
    );
    // CHECK IF hash IS CORRECT
    if (!result) {
      return res.json({ status: "error", message: "incorrect password" });
    }
    //  CREATING TOKEN
    const payload = {
      id: existingUser.rows[0].id,
      email: existingUser.rows[0].email,
    };
    const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });
    const refresh = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "30D",
      jwtid: uuidv4(),
    });
    const response = { access, refresh, payload };
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

// REFRESH TOKEN
const refreshToken = (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);
    const payload = {
      id: decoded.id,
      name: decoded.name,
    };
    const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    const response = { access };
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: "refresh token failed" });
  }
};

// UPDATE USER PROFILE (CHANGE USERNAME OR PASSWORD)
const updateUser = async (req, res) => {
  try {
    await pool.query(
      "UPDATE user_accounts SET email = $1, hash = $2 WHERE id = $3",
      [req.body.email, req.body.hash, req.params.id]
    );
    res.json("user updated");
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
  logIn,
  refreshToken,
};
