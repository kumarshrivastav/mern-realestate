import express from "express"
const app=express()
const server=app.listen(3000,()=>{
    console.log(`Server started at http://localhost:${server.address().port}`)
})