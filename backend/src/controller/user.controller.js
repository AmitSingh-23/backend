import asyncHandler from '../utlis/AsyncHandler.js';//function
import {ApiError} from '../utlis/ApiError.js';//class 
 import {User} from '../model/user.model.js'
 import {fileUpload} from '../utlis/cloudinary.js'
 import {ApiResponse} from '../utlis/apiResponse.js';
 import jwt from 'jsonwebtoken';
 
const  generateRefereshAndAccesstoken=async (userId)=>{
try{
    const user=await User.findById(userId);
    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();
   user.refreshToken=refreshToken;
    await user.save({validateBeforeSave:false});
   return {accessToken,refreshToken};
    }catch(err){
        
        throw new ApiError(500,"Something went wrong in generating toke ");
    }
}

const registerUser=asyncHandler(async(req,res)=>{
  
    const{fullName,email,username,password}=req.body
    const fields = [fullName, email, username, password];
   
    const hasEmpty = fields.some((field) => !field || field.trim() === "");
    console.log("hasEmpty:", hasEmpty);
    if (hasEmpty) {
        throw new ApiError(400, "All fields are required");
    }  

    //can also do {[fullName,email,user,password].some((field)=>fiels?.trim()===""){throw api error}
   const existingUser=await User.findOne({
        $or:[{email},{username}]
    })

    if(existingUser){
        throw new ApiError(409,"User already exist");
    }
    const avatarLocalPath=req.files?.avatar?.[0]?.path
    console.log("path available",avatarLocalPath);
    const coverImageLocalPath=req.files?.coverImage?.[0]?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required");
    }
    const avatar =await fileUpload(avatarLocalPath)
    const coverImage=await fileUpload(coverImageLocalPath)
   

    if(!avatar){
        throw new ApiError(400,"Avatar is required cloud");
    }
    const user=await User.create({
        fullName,
        email,
        username,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
    })
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"  //what do we dont need
    )
    if(!createdUser){
        throw new ApiError(500,"User not created");

    }
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully")
    )


})

const loginUser=asyncHandler(async(req,res)=>{
    const {email,username,password}=req.body
    if(!(email||username)){
        throw new ApiError(400,"Email or username is required");
    }

    const user= await User.findOne({
        $or:[{email},{username}]
    })

    if (!user){
        throw new ApiError(404,"User not found");
    }

    const isvalidpassword=await user.isPassword(password);
    
    if(!isvalidpassword){
        throw new ApiError(401,"Invalid password");
     }
    
     const {accessToken,refreshToken}=await generateRefereshAndAccesstoken(user._id);
    const loggedInUser=await User.findById(user._id).select(
          "-password -refreshToken"
      )
      const options={
        httpOnly:true,
        secure:true,     
      }

      res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
        new ApiResponse(200, loggedInUser, "User logged in successfully")
    )
})

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    )
     const options={
        httpOnly:true,
        secure:true,
      }  
      return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(
        new ApiResponse(200, {}, "User logged out successfully")
      )
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingrefreshToken=req.cookies?.refreshToken;
    if(!incomingrefreshToken){
        throw new ApiError(400,"unauthorised request");
    }
    const decoded=jwt.verify(
        incomingrefreshToken,
        process.env.REFRESH_TOKEN_SECRET,

    )
    const user=User.findById(decoded?._id)
    if(!user){
        throw new ApiError(404,"invali refreh token");
    }
    if(incomingrefreshToken!=user?.refreshToken){
        throw new ApiError(400,"unauthorised request doesnt match");
    }

    const {accessToken,newrefreshToken}=await generateRefereshAndAccesstoken(user._id);
    const options={
        httpOnly:true,
        secure:true,
      }  
      return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",newrefreshToken,options).json(
        new ApiResponse(200, {accessToken}, "accesstoekn refresh")
      )


})

const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const{oldPassword,newPassword}=req.body
    if(!oldPassword||!newPassword){
        throw new ApiError(400,"All fields are required");
    }
    const user=await User.findById(req.user?._id);
    const isValidPassword=await user.isPassword(oldPassword);
    if(!isValidPassword){
        throw new ApiError(401,"this is not your old password");
    }
   user.password=newPassword;
   await  user.save({validateBeforeSave:false});
   return res.status(200).json(
    new ApiResponse(200, {}, "Password changed successfully this is your new passwords "+newPassword)
   )


})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200).json(
        new ApiResponse(200, req.user, "User found")
    )
})
const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {fullName,email}=req.body;
    if(!fullName||!email){
        throw new ApiError(400,"All fields are required ");
        
    }
    const user=req.user;
    user.fullName=fullName;
    user.email=email;
    await user.save({validateBeforeSave:false});
    return res.status(200).json(
        new ApiResponse(200, user, "User updated successfully")
    )})

const updateUserAvatar=asyncHandler(async(req,res)=>{
    const avatarPath=req.file?.path;
    if(!avatarPath){
        throw new ApiError(400,"Avatar is required is missing");
    }
    const user=req.user;
    const avatarUrl=await fileUpload(avatarPath);
    if(!avatarUrl){
        throw new ApiError(500,"Something went wrong in uploading avatar");
    }
    user.avatar=avatarUrl.url;
    await user.save({validateBeforeSave:false});
    return res.status(200).json(
        new ApiResponse(200, user, "Avatar updated successfully")
    )
    })
    
const updateUsercoverImage=asyncHandler(async(req,res)=>{
    const coverImagePath=req.file?.path;
    if(!coverImagePath){
        throw new ApiError(400,"coverImage is required is missing");
    }
    const user=req.user;
    const coverImageUrl=await fileUpload(coverImagePath);
    if(!coverImageUrl){
        throw new ApiError(500,"Something went wrong in uploading coverImage");
    }
    user.avatar=avatarUrl.url;
    await user.save({validateBeforeSave:false});
    return res.status(200).json(
        new ApiResponse(200, user, "Avatar updated successfully")
    )
    })

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
} 