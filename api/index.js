import express from "express"
import dotenv from "dotenv"
import userRouter from "../api/routes/user.route.js"
import listingRouter from "../api/routes/listing.route.js"
import authRouter from "../api/routes/auth.route.js"
import ConnectDB from "./DbConfig.js"
import path from "path"
import cookieParser from "cookie-parser"
dotenv.config()
const app=express()
ConnectDB()
const __dirname=path.resolve()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use("/api/user/",userRouter)
app.use("/api/auth/",authRouter)
app.use("/api/listing/",listingRouter)
app.use(express.static(path.join(__dirname,'/client/dist')))
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'))
})
const server=app.listen(3000,()=>{
    console.log(`Server started at http://localhost:${server.address().port}`)
})

app.use((error,req,res,next)=>{
    const statusCode=error.statusCode || 500
    const message=error.message || "Internal Server Error"
    return res.status(statusCode).send({success:false,statusCode,message})
})