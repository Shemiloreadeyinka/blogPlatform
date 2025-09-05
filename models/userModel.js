const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    posts: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    role: { type: String, enum: ['writer', 'admin'], default: 'writer' },
    phoneNo: { type: String, unique: true },
    password: { type: String },
    profilePic: {
        url: { type: String, default: "https://res.cloudinary.com/dwnqinmja/image/upload/v1756825319/profilepic_s4skl9.jpg" },
        public_id: { type: String, default: "" }
    }

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)