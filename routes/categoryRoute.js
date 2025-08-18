const {addCategory,getCategory,getAllCategories,deleteCategory,updateCategory}= require("../controllers/userController")
const express= require("express")
const authentication= require("../middlewares/authMiddleware")
const authorization= require("../middlewares/adminMiddleware")
const route=express.Router()

route.post('/',authentication,authorization,addCategory);
route.get('/:id',authentication,getCategory);
route.get('/',authentication,getAllCategories);
route.delete('/:id',authentication,authorization,deleteCategory);
route.patch('/:name',authentication,authorization,updateCategory);
module.exports= route