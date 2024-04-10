const express = require("express");
const mongoose = require("mongoose");

const userRoute=require('./routes/user.route.js')

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-

const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));


app.use("/auth/register",userRoute);
    

mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    console.log("Database Connected");
  })
  .catch(() => {
    console.log("Connection Failed");
  });
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
