import { jwtDecode } from "jwt-decode";
import asyncHandler from "../utlis/AsyncHandler";
import { User } from "../model/user.model";
import { ApiError } from "../utlis/ApiError";


const authenticateUser=asyncHandler(async(req,res,next)=>
{
   try {
     const token=req.cookies?.accessToken|| req.header("Authorization")?.replace("Bearer","")
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