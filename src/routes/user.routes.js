import { Router } from "express";
import {registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router =Router();
router.route("/register").post(
    //multer middlerare to handle file uploads
    upload.fields([
{
    name:"avatar",
    maxCount:1
},
{
    name:"coverImage",
    maxCount:1
}
    ]),
    //till here multer middleware is used to handle file uploads
    registerUser)

export default router;