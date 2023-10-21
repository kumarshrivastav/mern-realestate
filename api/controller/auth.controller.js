import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import ErrorHandler from "../utils/error.handler.js"
class AuthController{
    async signup(req,res,next){
        try {
            // console.log(req.body)
            const {username,email,password}=req.body
            let user=await User.find().or([{username:username},{email:email}])
            console.log(user)
            if(user[0]){
                throw new Error("this email or username has been already taken")
            }
            user=new User({username,email,password})
            const salt =await bcryptjs.genSalt(10)
            const hashPwd=await bcryptjs.hash(password,salt)
            user.password=hashPwd
            const saveNewUser=await user.save()
            console.log('Saved:',saveNewUser)
            return res.status(201).send({message:"User Registered Successfully"})
        } catch (error) {
           next(ErrorHandler(501,error.message))
        }
    }
    async signin(req,res,next){
        try {
            const {email,password}=req.body
            const user=await User.findOne({email})
            if(!user){
                return next(ErrorHandler(404,"User Not Found!"))
            }
            const isValidPwd=await bcryptjs.compare(password,user.password)
            if(!isValidPwd){
                return next(ErrorHandler(401,"Wrong Credentials"))
            }
            const accessToken=jwt.sign({id:user._id},process.env.JWT_ACCESS_TOKEN_SECRET_KEY,{expiresIn:1000*60*60})
            res.cookie('accessToken',accessToken,{httpOnly:true,maxAge:1000*60*60})
            return res.send({message:"User Login Successfully"})


        } catch (error) {
            next(error)
        }
    }
}

export default new AuthController()