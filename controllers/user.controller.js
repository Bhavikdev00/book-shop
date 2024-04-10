const User = require("../models/user.model");


const registerUser=async(req, res) => {
    console.log(req.body);
   
  
    try {
      const user=await User.create(req.body);
      res.status(201).json({ status:"Success",message: "Email already registered" });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ status:"Failed",message: "Email already registered" });
      }
     return  res.status(500).json({ status:"Failed", message: "Internal Server Error"});
    }
  }


  module.exports={registerUser};