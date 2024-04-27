
const express = require("express");
const router=express.Router();
const {registerUser,loginUser,sendVerifyEmail,verifyEmail}=require('../controllers/user.controller.js');



router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/sendVerifyEmail",sendVerifyEmail);

router.get("/verify-email",verifyEmail)


module.exports=router;