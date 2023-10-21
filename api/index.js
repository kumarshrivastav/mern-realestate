import express from "express"
import dotenv from "dotenv"
import ConnectDB from "./DbConfig.js"
dotenv.config()
const app=express()
ConnectDB()
const server=app.listen(3000,()=>{
    console.log(`Server started at http://localhost:${server.address().port}`)
})