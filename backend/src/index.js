import mongoose from 'mongoose';
import { DB_NAME } from './constant';
import express from 'express';
const app = express();

;(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log("connected to database");
    app.on("error",(err)=>{
        console.error("error",err)
        throw err;
    })
  
  app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);       
  })
}

  catch (err) {
    console.error("error",err)
    throw err;
  } 
})()
   
