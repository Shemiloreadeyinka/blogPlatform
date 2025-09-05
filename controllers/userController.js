const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;
const fs = require("fs/promises")

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});


exports.register = async (req, res) => {
    const { name, email,password, phoneNo,role } = req.body
    try {
        if (!name || !email || !password || !phoneNo) return res.status(400).json({ message: 'please fill in credentials' })
        let user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: 'user already exists' })
        const hashedpassword = await bcrypt.hash(password, 10)
        let profilePicUrl = "https://res.cloudinary.com/dwnqinmja/image/upload/v1756825319/profilepic_s4skl9.jpg";
        let profilePicId = "placeholder";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'Profile Pictures',
            });
            profilePicUrl = result.secure_url;
            profilePicId = result.public_id;
            await fs.unlink(req.file.path);
        }
        user = new User({
            name, email, phoneNo, password: hashedpassword, role,  profilePic: {url: profilePicUrl,public_id: profilePicId}
        })
        await user.save()
        const {password:_, ...registeredUser}=user.toObject()
        return res.status(200).json({ message: 'user registered successfully',  user :registeredUser })

    } catch (error) {
          console.error("Register Error:", error);

        return res.status(500).json({ message: `Error saving user: ${error.message}` });

    }

}

exports.login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) return res.status(400).json({ message: " input credentials please" })
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "user doesn't exist" })
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.json(400).json({ message: "invalid credentials" })
        const token = jwt.sign({ id: user._id,role:user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.cookie("token", token, { httpOnly: true })
        const {password:_,...newUser}=user.toObject()
        return res.status(200).json({ message: 'login successful' , user:newUser})
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.getoneUser = async (req, res) => {
    const { userId } = req.params
    try {
        const user =await User.findById(userId).populate('posts')
        if (!user) return res.status(400).json({ message: "User doesn't exist" })
            const{password, ...newuser} =user.toObject()
        return res.status(200).json({ message: "user retrieved successfully", newuser })
    } catch (error) {
        return res.status(500).json({ error: error.message })

    }
}
exports.getallUsers = async (req, res) => {
    try {
        const users = await User.find().populate('posts')
            const newusers = users.map(user => {
                const { password, ...newusers } = user.toObject()
                return newusers
            })
        return res.status(200).json({ message: "users retrieved successfully", newusers })
    } catch (error) {
        return res.status(500).json({ error: `error in getting all users${error.message}` })
    }
}


exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "You're not authorized to delete this user" });
        }
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.profilePic && user.profilePic.public_id && user.profilePic.public_id !== "placeholder") {
            console.log("Deleting profile picture from Cloudinary:", user.profilePic.public_id);
            await cloudinary.uploader.destroy(user.profilePic.public_id);
        }
       await user.deleteOne();
        const { password, ...rest } = user.toObject();
        return res.status(200).json({ message: "User deleted successfully", user: rest });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
  const { id } = req.user;

  try {
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      if (
        user.profilePic &&
        user.profilePic.public_id &&
        user.profilePic.public_id !== "placeholder"
      ) {
        await cloudinary.uploader.destroy(user.profilePic.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads",
      });
      await fs.unlink(req.file.path);

      user.profilePic = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const { name, email, role, phoneNo, address } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (phoneNo) user.phoneNo = phoneNo;
    if (address) user.address = address;

    await user.save();

    const { password, ...updatedUser } = user.toObject();

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};
