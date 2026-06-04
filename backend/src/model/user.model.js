import { SchemaType } from "mongoose";
import bycrypt from "bcrypt";
import { jwtDecode } from "jwt-decode";
import mongoose from mongoose;
const userSchema = new mongoose.Schema({
    username:{
        type:string,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true
    },
    email:{
        type:string,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
      
    },
    fullname:{
        type:string,
        required:true,
        trim:true,
    
    },
    avatar:{
        type: string,
        required:true,   
    },
    coverImage:{
        type:string,
        
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"video",

        }
    ],
    password:{
        type:string,
        required:[true,"Password is reuired"],

    },
    refreshtoken:{
        typr:string,
    }
},{timestamps:true});

userschema.pre("save",async function(next){
    if(!this.isModified("password")) return next;
    this.password=await bycrypt.hash(this.password,10)
    next();
})


user.schema.methods.isPassword=async function(password){
    return await bycrypt.compare(password,this.password);
}


export const user=mongoose.model("usser",userSchema);