const {addCategory,getCategory,getAllCategories,deleteCategory,updateCategory}= require("../controllers/categoryController")
const express= require("express")
const authentication= require("../middlewares/authMiddleware")
const authorization= require("../middlewares/adminMiddleware")
const route=express.Router()

route.post('/',authentication,authorization,addCategory);
route.get('/:categoryId',authentication,getCategory);
route.get('/',authentication,getAllCategories);
route.delete('/:categoryId',authentication,authorization,deleteCategory);
route.patch('/:name',authentication,authorization,updateCategory);
module.exports= route