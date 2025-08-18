const {addComment,removeComment,editComment,getAllCommentsByUser,getCommentUnderPost}= require("../controllers/userController")
const express= require("express")
const authentication= require("../middlewares/authMiddleware")
const authorization= require("../middlewares/adminMiddleware")
const route=express.Router()

route.post('/',authentication,addComment)
route.delete('/:id',authentication,removeComment)
route.patch('/:id',authentication,editComment)
route.get('/:userid',authentication,authorization,getAllCommentsByUser)      
route.get('/:postid',authentication,getCommentUnderPost)      


module.exports= route