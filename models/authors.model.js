const mongoose = require("mongoose");


const authorsSchema = mongoose.Schema({
    authorName: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    }
},{ timestamps: true});


const Author=mongoose.model( 'Authors', authorsSchema );
module.exports = Author;