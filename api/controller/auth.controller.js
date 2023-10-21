import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
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
}

export default new AuthController()