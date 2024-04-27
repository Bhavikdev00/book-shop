const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userScema = mongoose.Schema(
  {
    firstName: { type: String },

    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    avatar: {
      type: String,
    },
      isVerified: { type: Boolean, required: true,default: false}
  },
  { timestamps: true }
);

userScema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userScema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userScema);
module.exports = User;
