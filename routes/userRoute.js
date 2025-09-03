const {register,login,getoneUser,getallUsers,deleteUser}= require("../controllers/userController")
const express= require("express")
const authentication= require("../middlewares/authMiddleware")
const route=express.Router()
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

route.post('/register',upload.single('profilePic'),register);
route.post('/login',login);
route.get('/',authentication, getallUsers)
route.get('/:userId',authentication, getoneUser)
route.delete('/:userId',authentication,deleteUser)

module.exports=route