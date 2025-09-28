import express from "express";
import authorize from "../controllers/authorization.js";

//! importing controllers 
import createBusiness from "../controllers/Business/createBusiness.js";
import findBusiness from "../controllers/Business/findBusiness.js";


const businessRouter = express.Router();


businessRouter.post("/",authorize,createBusiness);

businessRouter.get("/",authorize,findBusiness);


export default businessRouter; 