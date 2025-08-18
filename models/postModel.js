 const mongoose = require('mongoose');

const post  = new mongoose.Schema({
    author:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    category:{type: mongoose.Schema.Types.ObjectId, ref:'category'},
    title:{type: String, required:true ,trim:true},
    content:{type: String, required:true},
    comments:[{type: mongoose.Schema.Types.ObjectId, ref:'Comment'}],
    commentCount:{type:Number}

},{timestamps:true})


module.exports= mongoose.model("Post", productSchema)