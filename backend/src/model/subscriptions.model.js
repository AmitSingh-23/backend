import mongoose from "mongoose";
const subscriptionsSchema = new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,// one who is subscribed
        ref:"User",
        },
        channel:{
            type:mongoose.Schema.Types.ObjectId, // one who is getting subscribed
        ref:"User",

        } 
    
},{timeatamps:true});



export const subscriptions=mongoose.model("subscriptions",subscriptionsSchema);