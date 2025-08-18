const {register,login,getoneUser,getallUsers,deleteUser}= require("../controllers/userController")
const express= require("express")
const authentication= require("../middlewares/authMiddleware")
const authorization= require("../middlewares/adminMiddleware")
const route=express.Router()

route.post('/register',register);
route.post('/login',login);
route.get('/getuser/:id',authentication, getoneUser)
route.get('/getusers',authentication,authorization, getallUsers)
route.delete('/delete/:id',authentication,deleteUser)

module.exports=route