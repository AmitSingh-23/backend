import asyncHandler from '../utlis/AsyncHandler.js';//function
import {ApiError} from '../utlis/ApiError.js';//class 
 import {User} from '../model/user.model.js'
 import {fileUpload} from '../utlis/cloudinary.js'
 import {ApiResponse} from '../utlis/apiResponse.js';



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
        new ApiResponse({
            
            success:true,
            message:"User created successfully",
            data:createdUser,
        })
    )


})


const loginUser=asyncHandler(async(req,res)=>{
    const {email,username,password}=req.body
    if(!email||!username){
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
        new ApiResponse({
            statusCode:200,
            success:true,
            message:"User logged in successfully",
            data:loggedInUser,
        })
    )






})

const logoutUser=asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
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
        new ApiResponse({
            statusCode:200,
            success:true,
            data:{},
            message:"User logged out successfully",
        })
      )
})

export {
    registerUser,
    loginUser,
    logoutUser
} 