const {createPost,
getPost,
getPosts,
deletePost,
editPost,
getAllUserPost}= require("../controllers/postController")
const express= require('express');
const authentication= require("../middlewares/authMiddleware")
const route=express.Router()
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

route.get('/user/:userId',authentication, getAllUserPost);  
route.post('/',authentication, upload.array('postPic', 3), createPost);
route.get('/',authentication,getPosts);
route.get('/:id',authentication, getPost);  
route.delete('/:id',authentication,deletePost);
route.patch('/:id',authentication, upload.array('postPic', 3),editPost)


module.exports=route