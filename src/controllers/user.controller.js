import { asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import{User} from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser= asyncHandler(async(req,res)=>{
   //get user details from frontend



   const{ email,username,password,fullName}=req.body
   // console.log("req.body:",req.body)
   // console.log("email:",email,username,password,fullName);
   // if (fullName==""){
   //    throw new ApiError(400,"Full name is required");
   // }
   //some checks every feild and return true or false 
   if([email,username,password,fullName].some((feild)=>feild?.trim()==="")){
      throw new ApiError(400,"All fields are required");
   }
    const existedUser= await User.findOne({
      $or:[{username},{email}]
    })
    if(existedUser){
      throw new ApiError(409,"Username or email already exists");
    }
   const avatarLocalPath= req.files?.avatar[0]?.path;
   // const coverImageLocalPath=req.files?.coverImage[0]?.path;
   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
      coverImageLocalPath=req.files.coverImage[0].path;
   }
  
   if (!avatarLocalPath){
      throw new ApiError(400,"Avatar is required");
   }
//upload files to cloudinary
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
      username:username.toLowerCase(),
      password,

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