import express from "express"
import dotenv from "dotenv"
import userRouter from "../api/routes/user.route.js"
import ConnectDB from "./DbConfig.js"
dotenv.config()
const app=express()
ConnectDB()

app.use("/api/user/",userRouter)
const server=app.listen(3000,()=>{
    console.log(`Server started at http://localhost:${server.address().port}`)
})