const mongoose = require("mongoose");

const UserScema = mongoose.Schema({
  name: { type: String, required: [true, "Please Enter UserName"] },
  email: { type: String, required: true , unique : true},
  password: { type: String, required: true },
  phoneNumber: { type: String },
  image: {
    type: String,
    required:false
  },
});


const User=mongoose.model( 'User', UserScema );
module.exports = User;
   