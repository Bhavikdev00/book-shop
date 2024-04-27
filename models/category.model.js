const mongoose = require("mongoose");

const cateoryScema = mongoose.Schema({
    category_name:{type:String},

},{ timestamps: true});


const Cateory=mongoose.model( 'Cateory', cateoryScema );
module.exports = Cateory;
   