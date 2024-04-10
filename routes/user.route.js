const express = require("express");
const router=express.Router();
const {registerUser,loginUser}=require('../controllers/user.controller.js');

router.post("/register", registerUser);
router.get("/login", loginUser);

module.exports=router;