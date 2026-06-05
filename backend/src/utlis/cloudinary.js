import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';




 cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET,
 });
 console.log(process.env.CLOUDINARY_CLOUD_NAME)


 const fileUpload=async(filepath)=>{
    try{
    if (!filepath) {
      console.log("file not found");
      return null;
   }
    const response=await cloudinary.uploader.upload(filepath,{
        resource_type: "auto" 
    });

    // for testimng console.log("file uploaded",response.url);
    fs.unlinkSync(filepath);//unlink
    return response;/// return the url and stuff store it into a cosnt ot later connect
    }
 catch(error){
    console.error("Cloudinary Upload Error:", error);
    fs.unlinkSync(filepath);
    return null;
 }
}

 export {fileUpload};
 