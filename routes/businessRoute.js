import express from "express";
import authorize from "../controllers/authorization.js";

//! importing controllers 
import createBusiness from "../controllers/Business/createBusiness.js";


const businessRouter = express.Router();


businessRouter.post("/",authorize,createBusiness);


export default businessRouter;