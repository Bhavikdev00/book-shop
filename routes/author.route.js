const express = require("express");
const router=express.Router();
const {createAuthor,updateAuthor}=require('../controllers/author.controller');


router.post("/create-Author",createAuthor);
router.put("/update-Author/:id",updateAuthor);


module.exports=router;