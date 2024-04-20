const mongoose = require("mongoose");

const CateoryScema = mongoose.Schema({
    category_name:{type:String},

},{ timestamps: true});


const Cateory=mongoose.model( 'Cateory', CateoryScema );
module.exports = Cateory;
   