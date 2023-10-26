import ErrorHandler from "./error.handler.js"
import jwt from "jsonwebtoken"
export const verifyUser=(req,res,next)=>{
    const accessToken=req.cookies.accessToken
    // console.log(accessToken)
    if(!accessToken){
      next(ErrorHandler(401,'Unauthorized'))
    }
    const payload=jwt.verify(accessToken,process.env.JWT_ACCESS_TOKEN_SECRET_KEY)
    // console.log(payload)
    if(!payload.id){
        next(ErrorHandler(403,'Forbidden'))
    }
   
    req.userId=payload.id
    next()
}