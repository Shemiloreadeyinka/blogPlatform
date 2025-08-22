const express=require('express')
const   dotenv=require('dotenv')
const connectDB = require('./config')
const cookieParser = require('cookie-parser');


dotenv.config()
const app= express()
app.use(cookieParser())
app.use(express.json())
connectDB()
const PORT= process.env.PORT|| 3000
app.use('/users', require("./routes/userRoute"))
app.use('/posts', require("./routes/postRoute"))
app.use('/comments', require("./routes/commentRoute"))
app.use('/categories', require("./routes/categoryRoute"))

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status||500).json({ message: "Something went wrong", error: err.message });
});

app.listen(PORT,()=>console.log(` server is running on ${PORT}`)
)

module.exports=app