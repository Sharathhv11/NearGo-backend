import { Router } from "express";
import authorize from "../controllers/authorization.js";

import upload from "../utils/multer.js";
upload
import getUserInfo from "../controllers/Users/userInfo.js";
import updateUserProfile from "../controllers/Users/updateProfile.js";


const userProfileRoute =  Router();

userProfileRoute.patch("/:userId",authorize, upload.single('profilePicture'),updateUserProfile);

userProfileRoute.get("/",authorize, getUserInfo);

export default userProfileRoute;