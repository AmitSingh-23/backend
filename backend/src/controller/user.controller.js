import asyncHandler from '../utlis/AsyncHandler.js';
const registerUser=asyncHandler(async(req,res)=>{
    res.status(200).json({
        success:true,
        message:"ok"
    })


})

export {registerUser} 