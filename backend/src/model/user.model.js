import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { jwtDecode } from "jwt-decode";
import { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
      
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
    
    },
    avatar:{
        type: String,
        required:true,   
    },
    coverImage:{
        type:String,
        
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"video",

        }
    ],
    password:{
        type:String,
        required:[true,"Password is required"],

    },
    refreshToken:{
        type:String,
    }
},{timestamps:true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10)
    next();
})


userSchema.methods.isPassword=async function(password){
    return await bcrypt.compare(password,this.password);
}


export const User=mongoose.model("User",userSchema);