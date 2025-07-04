import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema= new Schema(
    {
    usrname:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullNmae:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    avatar:{
        type:String,
        required:true,
       
    },
    coverImage:{
        type:String,
        
       
    },
    refreshToken:{
        type:String,
        
       
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:'Video',

        }
    ],
    password:{
        type:String,
        required:[true,'Password is required'],
    }




},{
    timestamps:true,
}
)
userSchema.pre("save",async function(next){
    if(!this.isModified('password')) return next();
    this.password= await bcrypt.hash(this.password,10);
    next();
})
userSchema.methods.isPasswwordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAcessToken=function(){
 return jwt.sign(
    {
        _id:this._id,
        email:this.email,
        username:this.usrname,
        fullName:this.fullName,

    },
    process.env.ACESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken=function(){
return jwt.sign(
    {
        _id:this._id

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }


)
}
export const User=mongoose.model('User',userSchema);