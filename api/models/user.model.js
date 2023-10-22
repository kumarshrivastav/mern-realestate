import mongoose, { mongo } from "mongoose"
const userSchema=new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    avatar:{type:String,default:"https://th.bing.com/th?id=OIP.JZBTJtNF8UwcrOQhh-UgogAAAA&w=250&h=250&c=8&rs=1&qlt=30&o=6&pid=3.1&rm=2"}
},{timestamps:true})

const User=mongoose.models.users || mongoose.model("users",userSchema)

export default User;