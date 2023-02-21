const mongoose = require("mongoose")

const connectDB = async (uri) => {
    try {
      await mongoose.connect(uri);
      console.log("DB connected");
    } catch (error) {
      console.error(error.message);
      process.exit(1)
    }   
}

module.exports = connectDB