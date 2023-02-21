require("dotenv").config()
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const express = require("express")
const cors = require("cors")
const connectDB = require("./db/db")
const users = require("./routers/users");


const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

connectDB(process.env.MONGODB_URI)

app.use("/api", users)

app.listen(5000)