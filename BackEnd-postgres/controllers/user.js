const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { parse } = require("pg-protocol");

// DSIPLAY ALL USERS
const getUsers = async (req, res) => {
  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [req.body.email]
    );
    // res.json(existingUser.rows[0])
    if (existingUser.rows[0].admin === true) {
      console.log("granted admin access");
      const user = await pool.query("SELECT * FROM users");
      res.json(user.rows);
    } else {
      res.json({ status: "error", message: "user has no admin rights" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// SEEDING INITAL DATA
const seeding = async (req, res) => {
  try {
    // CLEARING ALL USERS, FAVS, CARTS AND SHIPMENT
    await pool.query("DELETE FROM favs");
    await pool.query("DELETE FROM cart");
    await pool.query("DELETE FROM shipment");
    await pool.query("DELETE FROM users");

    // RESETTING SEQUENCE TO 1
    await pool.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await pool.query("ALTER SEQUENCE favs_id_seq RESTART WITH 1");
    await pool.query("ALTER SEQUENCE cart_id_seq RESTART WITH 1");
    await pool.query("ALTER SEQUENCE shipment_id_seq RESTART WITH 1");

    // FIRST ACCOUNT
    await pool.query(
      "INSERT INTO users(email, hash, admin) VALUES ($1, $2, $3) RETURNING *",
      ["mrmuhdamir@gmail.com", "92344590", true]
    );
    await pool.query("INSERT INTO favs (users_id) VALUES ($1)", [1]);
    await pool.query("INSERT INTO cart (users_id) VALUES ($1)", [1]);
    await pool.query("INSERT INTO shipment (users_id) VALUES ($1)", [1]);
    // SECOND ACCOUNT
    await pool.query(
      "INSERT INTO users (email, hash) VALUES ($1, $2) RETURNING *",
      ["test@gmail.com", "123456789"]
    );
    await pool.query("INSERT INTO favs (users_id) VALUES ($1)", [2]);
    await pool.query("INSERT INTO cart (users_id) VALUES ($1)", [2]);
    await pool.query("INSERT INTO shipment (users_id) VALUES ($1)", [2]);
    // THIRD ACCOUNT
    await pool.query(
      "INSERT INTO users (email, hash) VALUES ($1, $2) RETURNING *",
      ["hello@gmail.com", "123456789"]
    );
    await pool.query("INSERT INTO favs (users_id) VALUES ($1)", [3]);
    await pool.query("INSERT INTO cart (users_id) VALUES ($1)", [3]);
    await pool.query("INSERT INTO shipment (users_id) VALUES ($1)", [3]);
    // FOURTH ACCOUNT
    await pool.query(
      "INSERT INTO users (email, hash) VALUES ($1, $2) RETURNING *",
      ["bye@gmail.com", "123456789"]
    );
    await pool.query("INSERT INTO favs (users_id) VALUES ($1)", [4]);
    await pool.query("INSERT INTO cart (users_id) VALUES ($1)", [4]);
    await pool.query("INSERT INTO shipment (users_id) VALUES ($1)", [4]);
    // FIFTH ACCOUNT
    await pool.query(
      "INSERT INTO users (email, hash) VALUES ($1, $2) RETURNING *",
      ["world@gmail.com", "123456789"]
    );
    await pool.query("INSERT INTO favs (users_id) VALUES ($1)", [5]);
    await pool.query("INSERT INTO cart (users_id) VALUES ($1)", [5]);
    await pool.query("INSERT INTO shipment (users_id) VALUES ($1)", [5]);
    const users = await pool.query("SELECT * FROM users");
    // res.json(user.rows);

    // ENCRYPTING PASSWORDS
    users.rows.map(async (user, index) => {
      const encrypted = await bcrypt.hash(user.hash, 12);
      await pool.query("UPDATE users SET hash =$1 WHERE id = $2", [
        encrypted,
        index + 1,
      ]);
      console.log(user.hash);
      console.log(encrypted);
    });
    res.json("seeding successful");
  } catch (error) {
    console.log("ERROR seeding unsuccessful", error.message);
  }
};

// DISPLAY PARTICULAR USER USING PARAMS (SEARCH BY ID)
const targetUser = async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
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
      "SELECT email FROM users WHERE email = $1",
      [req.body.email]
    );
    if (existingUser.rows[0]) {
      // console.log("hello");
      console.log(existingUser.rows);
      return res.json({ status: "error", message: "duplicate email" });
    }
    // res.json(existingUser.rows[0]);
    const hash = await bcrypt.hash(req.body.hash, 12);
    const user = await pool.query(
      "INSERT INTO users (email, hash, admin) VALUES($1, $2, $3) RETURNING *",
      [req.body.email, hash, req.body.admin]
    );
    const rowNumberFavs = await pool.query("SELECT COUNT(*) FROM favs");
    let nextRowNumberFavs = parseInt(rowNumberFavs.rows[0].count);
    // console.log("next number of rows in favs:", (nextRowNumberFavs += 1));
    await pool.query("INSERT INTO favs (users_id) VALUES ($1)", [
      (nextRowNumberFavs += 1),
    ]);
    const rowNumberCart = await pool.query("SELECT COUNT(*) FROM cart");
    let nextRowNumberCart = parseInt(rowNumberCart.rows[0].count);
    // console.log("next number of rows in favs:", (nextRowNumberFavs += 1));
    await pool.query("INSERT INTO cart (users_id) VALUES ($1)", [
      (nextRowNumberCart += 1),
    ]);
    const rowNumberShipment = await pool.query("SELECT COUNT(*) FROM shipment");
    let nextRowNumberShipment = parseInt(rowNumberShipment.rows[0].count);
    // console.log("next number of rows in favs:", (nextRowNumberFavs += 1));
    await pool.query("INSERT INTO shipment (users_id) VALUES ($1)", [
      (nextRowNumberShipment += 1),
    ]);

    // RETURNING * only for INSERT
    // res.json(user.rows[0]);
    res.json("new user created")
  } catch (error) {
    console.log(error.message);
  }
};

// LOGGING IN
const logIn = async (req, res) => {
  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
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
    const response = {
      access,
      refresh,
      payload,
      adminStatus: existingUser.rows[0].admin,
    };
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

// UPDATE USER PROFILE (CHANGE PASSWORD)
const updateUser = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.hash, 12);
    await pool.query("UPDATE users SET hash = $1 WHERE id = $2", [
      hash,
      req.params.id,
    ]);
    res.json("password updated");
  } catch (error) {
    console.log(error.message);
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    await pool.query("DELETE FROM users where id = $1", [req.params.id]);
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
