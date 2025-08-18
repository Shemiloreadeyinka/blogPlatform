const {createPost,
getPost,
getPosts,
deletePost,
editPost}= require("../controllers/postController")
const express= require('express');
const authentication= require("../middlewares/authMiddleware")
const route=express.router()

route.post('/create',authentication, createPost);
route.get('/:id',authentication, getPost);  
route.get('/',authentication,getPosts);
route.delete('/:id',authentication,deletePost);
route.patch('/:id',authentication,editPost)

module.exports=route