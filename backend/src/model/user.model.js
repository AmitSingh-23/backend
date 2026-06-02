import { SchemaType } from "mongoose";
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
})




export const user=mongoose.model("usser",userSchema);