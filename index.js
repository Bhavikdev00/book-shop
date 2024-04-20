const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoute=require('./routes/user.route.js')

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// for parsing application/x-www-

require('dotenv').config();


app.get("/", (req, res) => res.status(200).send({name:"bhavik",hyy:"hello"}));


app.use("/auth",userRoute);
app.use("/auth",userRoute);

mongoose
  .connect("mongodb+srv://Bhavik:Bhavik2004@shopapp.mwu3opv.mongodb.net/?retryWrites=true&w=majority&appName=shopApp")
  .then(() => {
    console.log("Database Connected");
    console.log(`Cloud Name: ${process.env.CLOUD_NAME}`);
  })
  .catch(() => {
    console.log("Connection Failed");
  });
app.listen(process.env.PORT || 3000, () => console.log(`Example app listening on port ${process.env.PORT || 3000}!`));
