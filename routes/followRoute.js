import express from "express";
import getFollowCount from "../controllers/Business/followContollers/getFollwersCount.js";
import authorize from "../controllers/authorization.js";

// import getFollowListPaginated from "../controllers/follow/getFollowList.controller.js";

const followRoute = express.Router();

followRoute.get("/count", authorize, getFollowCount);
// followRoute.get("/list", getFollowListPaginated);


export default followRoute;
