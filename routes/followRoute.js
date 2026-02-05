import express from "express";
import getFollowCount from "../controllers/Business/followContollers/getFollwersCount.js";
import authorize from "../controllers/authorization.js";
import getFollowList from "../controllers/Business/followContollers/getFollowingList.js";



const followRoute = express.Router();

followRoute.get("/count", authorize, getFollowCount);
followRoute.get("/list",authorize, getFollowList);


export default followRoute;
