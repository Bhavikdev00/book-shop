const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const fs=require("fs");
const nodemailer = require("nodemailer");

const {processBase64Image,uploadFileAndCleanUp} = require("../middlewares/multer.middleware");

const registerUser=async(req, res) => {
    console.log(req.body);
   
  
    try {
      const base64Data=req.body.avatar;
      const check_user=await User.findOne({email:req.body.email});
      if(check_user) {
        if(check_user.isVerified === true){
          return res.status(409).json({ status:"Failed",message: "Email already registered" });

        }else{
          await User.deleteOne({email:check_user.email});
        }
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
   

    try {
      // Find user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ status: "Failed", message: "User not found" });
      }

      if (user.isVerified === false) {
        return res.status(404).json({ status:"failed", message: "Please Verify your account" });
      }

  
      // Check if password matches
      const isPasswordValid = user.isPasswordCorrect(user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ status: "Failed", message: "Invalid password" });
      }
      const currentUser=await User.findById(user._id).select("-password -__v")
  
      // If email and password are correct, return success message
      const token = jwt.sign({ _id:user._id,name:user.name,email:user.email }, process.env.JWT_SECRET, { expiresIn: "100h" });
      res.status(200).json({ status: "Success",data:currentUser, message: "Login successful" ,token});
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ status: "Failed", message: "Internal Server Error" });
    }

  }


  const sendVerifyEmail=async (req, res) => {
    const { email } = req.body;
    const user=await  User.findOne({ email: email});
    if(!user) {
      return res.status(400).json({ status: "Failed",message: "User not found" });
    }
    const transporter = nodemailer.createTransport({
      service:'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 20px auto;
                            background: #ffffff;
                            padding: 20px;
                            box-shadow: 0 0 20px rgba(0,0,0,0.1);
                            border-radius: 5px;
                            border-top: 4px solid #0056b3;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            margin: 20px 0;
                            background-color: mediumseagreen;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 5px;
                            text-align: center;
                        }
                        .footer {
                            text-align: center;
                            font-size: 12px;
                            color: #777777;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <h1>Verify Your Email Address</h1>
                        <p>Thanks for signing up! Before getting started, could you please verify your email address by clicking the link below?</p>
                        <a href="http://localhost:3000/auth/verify-email?token=${token}" class="button">Verify Email</a>
                        <p>If you did not create an account, no further action is required.</p>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Book Shop. All rights reserved.</p>
                        </div>
                    </div>
                </body>
            </html>
        `
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
    });
    return res.status(200).json({ status: "Success", message: "Email Sent Successfully" });
  }



const verifyEmail=async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Token is valid
    let doc = await User.findOneAndUpdate({email:decoded.email},{isVerified:true});

    let result =await User.findOneAndUpdate({email:doc.email});

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification Success</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f7f8fa;
            color: #333;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
        .message-box {
            background: white;
            padding: 40px 60px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            text-align: center;
            width: 90%;
            max-width: 500px;
        }
        h1 {
            color: #4CAF50;
            font-size: 24px;
            margin-bottom: 10px;
        }
        p {
            font-size: 16px;
            color: #666;
            margin-top: 0;
        }
    </style>
</head>
<body>
    <div class="message-box">
        <h1>Email Verification Successful!</h1>
        <p>Your email has been successfully verified. Thank you for registering with us.</p>
       
    </div>
</body>
</html>
`);
  } catch (error) {
    // Token is invalid
    res.status(400).send("Verification Failed Please Try After some time");
  }
}


  module.exports={registerUser,loginUser,sendVerifyEmail,verifyEmail};



  