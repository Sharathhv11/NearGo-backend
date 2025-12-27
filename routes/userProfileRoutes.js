import { Router } from "express";
import mongoose from "mongoose";
import authorize from "../controllers/authorization.js";
import addProfile from "../controllers/authentication/profile.js";
import upload from "../utils/multer.js";
upload
import getUserInfo from "../controllers/Users/userInfo.js";
import updateUserProfile from "../controllers/Users/updateProfile.js";


const userProfileRoute =  Router();

userProfileRoute.patch("/:userId/",authorize, upload.single('profile'),updateUserProfile);

userProfileRoute.get("/",authorize, getUserInfo);

export default userProfileRoute;