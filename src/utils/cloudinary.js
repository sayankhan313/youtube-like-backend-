import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary= async (localFilePath)=>{
    try {
        if(!localFilePath){
            return null;
        }
        //UPLOAd file on cloidinary
         const response=await cloudinary.uploader.upload (localFilePath,{
            resource_type: "auto",
        // FILE HAS SUCESFULLY UPLOADED


        })
        fs.unlinkSync(localFilePath); // Delete the file after upload
       
        return response;
        // console.log("File uploaded clodinary successfully:", response);

        
    } catch (error) {
        fs.unlinkSync(localFilePath); // Delete the file if upload fails
        return null;
    }
}

export {uploadOnCloudinary};