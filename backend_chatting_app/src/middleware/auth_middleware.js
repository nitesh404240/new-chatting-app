import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import { User } from "../model/user_model.js";
import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const verifyJWT = asynchandler(async(req,res,next)=>{
     try{ 
    const accessToken = req.cookies?.accessToken

   // console.log(accessToken)
    if(!accessToken){
        throw new ApiError(404,"no accesstoken fetched")
    }

    const decode_user = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
//console.log(decode_user)
    if(!decode_user){
        throw new ApiError(404,"no user found or session expired")
    }

    const user = await User.findById(decode_user._id).select("-refreshToken")
//console.log(user)
    req.user = user

    
    next()
}catch(error){
     throw new ApiError(401,error?.message||"internal error",)
    }
})

