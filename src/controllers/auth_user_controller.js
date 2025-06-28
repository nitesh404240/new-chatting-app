import { User } from "../model/user_model.js";
import mongoose from "mongoose";
import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {uploadOncloudinary} from "../utils/uploadOnCloudinary.js";

const generateToken = async(user)=>{
   const AccessToken = await user.generateAccessToken(); // ✅ Correct
const RefreshToken = await user.generateRefreshToken(); // ✅ Correct


    user.refreshToken = RefreshToken

    await user.save({ validateBeforeSave: false });

    return {RefreshToken,AccessToken}
}

const sign_up = asynchandler(async(req,res)=>{
   
    const {fullname ,email,username,password} = req.body

    if(!email ||!fullname ||!username||!password){
        throw new ApiError(404,"details of user are missing")
    }
  
    console.log(email)
    try{

        const emailexist =await User.findOne({email})
        
        //console.log(emailexist)

       if(emailexist){
           throw new ApiError(409,"user with email already exist")
    }
       
         const usernameexist =await User.findOne({username})

         if(usernameexist){
             throw new ApiError(409,"user with username already exist")

         }
         const profilepic_path = req.file.path;
           
         //console.log(profilepic_path)

         if(!profilepic_path){
             throw new ApiError(400,"avatar is required")
         }
    
      const profilepic = await uploadOncloudinary(profilepic_path)
         //console.log(profilepic)
      if(!profilepic){
             throw new ApiError(400,"profilepic file is required")
      }
     
        const newuser = await User.create({
                fullname,
                profilepic ,
        
                email, 
                password,
                username: username.toLowerCase()
    }) 
     //console.log(newuser)
        const usercreated= await User.findById(newuser._id).select(
                "-password -refreshTokens"
    )
     //console.log(usercreated)
    if(!usercreated){
    throw new ApiError(500,"somthing went wrong while signup")

}
return res.status(201).json(
    new ApiResponse(200,usercreated,"user signup successfully")
)

    }catch(error){
         throw new ApiError(500,"user not sign-up successfully",error)
    }

})

const login = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(404, "Password or email is missing");
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "No user found");
    }

    const ispasswordcorrect = await user.isPasswordCorrect(password);

    if (!ispasswordcorrect) {
      throw new ApiError(404, "Password is not matched");
    }

    const { RefreshToken, AccessToken } = await generateToken(user);

    if (!AccessToken?.trim() || !RefreshToken?.trim()) {
      throw new ApiError(401, "Access Token or Refresh Token is missing or empty.");
    }

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
      httpOnly: true,
      secure: true
    };

    return res
      .status(200)
      .cookie("accessToken", AccessToken, options)
      .cookie("refreshToken", RefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            AccessToken,
            RefreshToken
          },
          "User logged in successfully"
        )
      );

  } catch (error) {
    throw new ApiError(500, "User not logged in successfully");
  }
});

const updatePassword = asynchandler(async(req,res,next)=>{
  const {newPassword,oldPassword} = req.body

  if(!newPassword || !oldPassword){
    throw new ApiError(404,"password is required")
  }

  if(newPassword == oldPassword){
    throw new ApiError(404,"password must be different from old password")
  }

  try{
    
    const verifypassword = await User.isPasswordCorrect(oldPassword)

    if(!verifypassword){
      throw new ApiError(404,"password is not corrrect")
    }

    const changepassword = await User.findById(
      req.user._id ,
      {
        $set : {
          password : newPassword
        }
      },{
        new : true
      }
    )
    
     await changepassword.save({validateBeforeSave : false})

      return res.status(200)
     .json(new ApiResponse(200,"password change successfully"))
  }catch(error){

  }

})
const logoutUser = asynchandler(async (req, res) => {
      
         await  User.findByIdAndUpdate(
            req.user._id, 
            {
              $unset: {
                refreshToken: 1 //this remove field from databse
              }
            },
            {
              new: true, // to get updated new value with a refresh token as undefined otherqise we will get same value of refresh token
            }
          ) 
          //  -clear cookies
          const options = {
            httpOnly: true,
            secure: true,
          }
          //  console.log(req.user, "LOG OUT")
          return res
          .status(200)
          .clearCookie("refreshToken", options)
          .clearCookie("accessToken", options)
          .json(
    new ApiResponse(
        200,
        "user logged out Successfully"
    )
)
  })

export {
    sign_up,login,updatePassword,logoutUser
}