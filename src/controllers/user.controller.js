import { asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import{User} from "../models/User.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser= asyncHandler(async(req,res)=>{
   //get user details from frontend



   const{ email,username,passwrord,fullName}=req.body
   console.log("email:",email,username,passwrord,fullName);
   // if (fullName==""){
   //    throw new ApiError(400,"Full name is required");
   // }
   //some checks every feild and return true or false 
   if([email,username,passwrord,fullName].some((feild)=>feild?.trim()==="")){
      throw new ApiError(400,"All fields are required");
   }
    const existeedUser=User.findOne({
      $or:[{username},{email}]
    })
    if(existeedUser){
      throw new ApiError(409,"Username or email already exists");
    }
   const avatarLocalPath= req.files?.avatar[0]?.path;
   const coverImageLocalPath=res.files?.coverImage[0]?.path;
   if (!avatarLocalPath){
      throw new ApiError(400,"Avatar is required");
   }

   const avatar= await uploadOnCloudinary(avatarLocalPath)
   const coverImage= await uploadOnCloudinary(coverImageLocalPath);
   if (!avatar){
      throw new ApiError(500,"Avatar upload failed");
   }
   const user= await User.create({
      fullName,
      avatar:avatar.url,
      coverImage:coverImage?.url||'',
      email,
      username :username.toLowerCase(),

   })

 const createdUser= await  User.findById(user._id).select(
   "-password -refreshToken"
 )
if(!createdUser){
   throw new ApiError(500,"User creation failed");
}
return res.status(201).json(
   new ApiResponse(200,createdUser,'User created successfully')
)


})
export  {registerUser}