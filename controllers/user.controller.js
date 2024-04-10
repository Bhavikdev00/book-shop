const User = require("../models/user.model");
const jwt = require("jsonwebtoken");


const registerUser=async(req, res) => {
    console.log(req.body);
   
  
    try {
      const user=await User.create(req.body);
      res.status(201).json({ status:"Success",message: "User Created Successfully" });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ status:"Failed",message: "Email already registered" });
      }
     return  res.status(500).json({ status:"Failed", message: "Internal Server Error"});
    }
  }

  const loginUser=async(req, res) => {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    try {
      // Find user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ status: "Failed", message: "User not found" });
      }
  
      // Check if password matches
      const isPasswordValid = await user.password == password;
  
      if (!isPasswordValid) {
        return res.status(401).json({ status: "Failed", message: "Invalid password" });
      }
  
      // If email and password are correct, return success message
      const token = jwt.sign({ _id:user._id,name:user.name,email:user.email }, "Bhavik@200494816", { expiresIn: "1h" });
      res.status(200).json({ status: "Success", message: "Login successful" ,token});
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ status: "Failed", message: "Internal Server Error" });
    }

  }


  module.exports={registerUser,loginUser};