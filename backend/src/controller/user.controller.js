import asyncHandler from '../utlis/AsyncHandler.js';//function
import {ApiError} from '../utlis/ApiError.js';//class 
 import {User} from '../model/user.model.js'
 import {fileUpload} from '../utlis/cloudinary.js'
 import {ApiResponse} from '../utlis/apiResponse.js';
const registerUser=asyncHandler(async(req,res)=>{
    
    const{fullName,email,username,password}=req.body
    const fields = [fullName, email, username, password];
    if (fields.some((field) => !field || field.trim() === "")) {
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
    console.log("avatar",avatar);

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
        new ApiResponse({
            
            success:true,
            message:"User created successfully",
            data:createdUser,
        })
    )


})

export {registerUser} 