const {addComment,removeComment,editComment,getAllCommentsByUser,getCommentUnderPost}= require("../controllers/commentController")
const express= require("express")
const authentication= require("../middlewares/authMiddleware")
const authorization= require("../middlewares/adminMiddleware")
const route=express.Router()

route.post('/:postId',authentication,addComment)
route.delete('/:commentId',authentication,removeComment)
route.patch('/:commentId',authentication,editComment)
route.get('/user/:userId',authentication,getAllCommentsByUser)      
route.get('/post/:postId',authentication,getCommentUnderPost)      


module.exports= route