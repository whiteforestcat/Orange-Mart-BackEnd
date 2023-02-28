const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json())

app.listen(5000, () => {
  console.log("server connected to PORT 5000");
});
