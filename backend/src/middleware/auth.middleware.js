import jwtDecode from "jsonwebtoken";
import asyncHandler from "../utlis/asyncHandler.js";
import { User } from "../model/user.model.js";
import { ApiError } from "../utlis/ApiError.js";


const authenticateUser=asyncHandler(async(req,res,next)=>
{
   try {
     const token=req.cookies?.accessToken|| req.header("Authorization")?.replace("Bearer ","").trim()
    if(!token){
        throw new Error(401,"User Not Found no token");
    }
    const decodedToken=jwtDecode.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const user=await User.findById(decodedToken?._id).select("-password -refreshToken");
    if(!user){
        throw new Error(401,"User Not Found");
    }
    req.user=user;
    next();
    
   } catch (error) {
    res.status(error.statusCode||500).json({
        success:false,
        message : error.message || "Internal Server Error (auth middleware)"
    })
    
   }
    

})
    
    


export {authenticateUser}