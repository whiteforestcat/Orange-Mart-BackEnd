const User = require("../models/User");
const Message = require("../models/Message");

const validateUser = async (req, res, func) => {
  try {
    const user = await User.findOne({ username: "takecare@gmail.com" });
    console.log(user.email);
    if (!user) {
      console.log("User does not exist");
      return res.json({ status: "error", message: "user not found" });
    }
    func(user);
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: "unable to validate user" });
  }
};

// SEED MESSAGES
const seedMessage = async (req, res) => {
    await Message.deleteMany()
    res.json({status: "okay", message: "message seeded successfully"})
}


const createMessage = async (req, res) => {
    try {
      await Message.create({
        email: req.body.email,
        title: req.body.title,
        content: req.body.content,
      });
      res.json({
        status: "okay",
        message: "message successfully created",
      });
    } catch (error) {
      console.log(error);
      return res.json({ status: "error", message: "message not created" });
    }
};

// FIND MESSAGES BY EMAIL
const getMessage = async (req, res) => {
    try {
        const message = await Message.find({email: req.body.email})
        if (!message) {
            return res.json({status: "error", message: "associated email has no messages"})
        }
        res.json(message)
    }
    catch (error) {
        console.log(error)
        res.json({status: "error", message: "unable to retrieve message"})
    }
}

module.exports = { createMessage, seedMessage, getMessage };
