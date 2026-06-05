import mongoose from "mongoose";
import bycrypt from "bcrypt";
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
    fullname:{
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
        required:[true,"Password is reuired"],

    },
    refreshToken:{
        typr:String,
    }
},{timestamps:true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next;
    this.password=await bycrypt.hash(this.password,10)
    next();
})


userSchema.methods.isPassword=async function(password){
    return await bycrypt.compare(password,this.password);
}


export const User=mongoose.model("User",userSchema);