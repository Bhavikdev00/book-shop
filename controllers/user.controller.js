const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const fs=require("fs");

const {processBase64Image,uploadFileAndCleanUp} = require("../middlewares/multer.middleware");

const registerUser=async(req, res) => {
    console.log(req.body);
   
  
    // try {
      const base64Data=req.body.avatar;
      const check_user=await User.findOne({email:req.body.email});
      if(check_user){
        return res.status(409).json({ status:"Failed",message: "Email already registered" });
      }
      const imageUrl= await processBase64Image(base64Data,"jpg");

      // // Upload local file to Cloudinary and delete local file
      // const imageUrl = await uploadFileAndCleanUp(filePath);
      console.log(imageUrl);
      const user=new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName,phoneNumber:req.body.phoneNumber,
        email:req.body.email,
        password:req.body.password,
        avatar:imageUrl,
      });
      await user.save();

      const currentUser=await User.findById(user._id).select("-password");
      return res.status(201).json({ status:"Success",data:currentUser,message: "User Created Successfully" });
    // } catch (error) {
    //   if (error.code === 11000) {
    //     return res.status(409).json({ status:"Failed",message: "Email already registered" });
    //   }
    //  return  res.status(500).json({ status:"Failed", message: "Internal Server Error"});
    // }
  }

  const loginUser=async(req, res) => {
    const { email, password } = req.body;
    console.log(email);
   

    try {
      // Find user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ status: "Failed", message: "User not found" });
      }
  
      // Check if password matches
      const isPasswordValid = user.isPasswordCorrect(user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ status: "Failed", message: "Invalid password" });
      }
      const currentUser=await User.findById(user._id).select("-password -__v")
  
      // If email and password are correct, return success message
      const token = jwt.sign({ _id:user._id,name:user.name,email:user.email }, "Bhavik@200494816", { expiresIn: "100h" });
      res.status(200).json({ status: "Success",data:currentUser, message: "Login successful" ,token});
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ status: "Failed", message: "Internal Server Error" });
    }

  }


  module.exports={registerUser,loginUser};



  