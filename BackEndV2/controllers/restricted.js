const User = require("../models/User");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// SHOW ALL USERS
const getUsers = async (req, res) => {
  const allUsers = await User.find();
  res.json(allUsers);
};

// SEEDING INITIAL DATA
const seeding = async (req, res) => {
  await User.deleteMany();

  await User.create(
    [
      { email: "mrmuhdamir@gmail.com", hash: "123456" },
      { email: "test@gmail.com", hash: "123456" },
      { email: "example@gmail.com", hash: "123456" },
      { email: "hello@gmail.com", hash: "123456" },
    ],
    (error, data) => {
      if (error) {
        console.log(error);
        res.json({ status: "error", message: "seeding unsucessful" });
      } else {
        res.json({ status: "ok", message: "seeding successful" });
      }
    }
  );
};

// CREATE NEW USER
const newUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.json({ status: "error", message: "duplicate email" });
    }

    const hash = await bcrypt.hash(req.body.hash, 12);

    const createdUser = await User.create({
      email: req.body.email,
      hash,
    });
    console.log("created user is ", createdUser);
    res.json({ status: "Okay", message: "user created" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: "an error has occured" });
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

// LOGGING IN
const logIn = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // CHECKING IF EMAIL EXISTS
    if (!user) {
      return res.json({ status: "error", message: "email does not exist" });
    }
    // CHECK IF PASSWORD IS CORRECT
    const result = await bcrypt.compare(req.body.hash, user.hash);
    if (!result) {
      return res.json({ status: "okay", message: "incorrect password" });
    }
    //  CREATING TOKEN
    const payload = {
      id: user._id,
      email: user.email,
    };
    const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });
    const refresh = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "30D",
      jwtid: uuidv4(),
    });
    const response = { access, refresh };
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: "sign in error" });
  }
};

module.exports = { getUsers, seeding, newUser, logIn, refreshToken };
