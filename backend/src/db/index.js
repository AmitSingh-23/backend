import mongoose from 'mongoose';
import {DB_NAME} from '../constant.js';


const mongooseconnect= async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        console.log("connected to database",DB_NAME );
    }
    catch (error){
        console.error("errno connection to database",error);
        process.exit(1);

    }


    }


export default mongooseconnect;