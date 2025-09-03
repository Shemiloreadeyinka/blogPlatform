 const mongoose = require('mongoose');

const postSchema  = new mongoose.Schema({
    author:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    postPic: [{ type: String },{ public_id: { type: String, required: true } }],
    category:{type: mongoose.Schema.Types.ObjectId, ref:'Category'},
    title:{type: String, required:true ,trim:true},
    content:{type: String, required:true},
    comments:[{type: mongoose.Schema.Types.ObjectId, ref:'Comment'}],
    commentCount:{type:Number, default:0}

},{timestamps:true})


module.exports= mongoose.model("Post", postSchema)