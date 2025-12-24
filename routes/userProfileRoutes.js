import { Router } from "express";
import mongoose from "mongoose";
import authorize from "../controllers/authorization.js";
import addProfile from "../controllers/authentication/profile.js";
import upload from "../utils/multer.js";
upload
import getUserInfo from "../controllers/Users/userInfo.js";


const userProfileRoute =  Router();

userProfileRoute.patch("/:userId/profile",authorize, upload.single('profile'),addProfile);

userProfileRoute.get("/",authorize, getUserInfo);

export default userProfileRoute;