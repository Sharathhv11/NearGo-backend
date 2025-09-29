import express from "express";
import authorize from "../controllers/authorization.js";

//! importing controllers 
import createBusiness from "../controllers/Business/createBusiness.js";
import findBusiness from "../controllers/Business/findBusiness.js";
import updateBusiness from "../controllers/Business/updateBusiness.js";


const businessRouter = express.Router();


businessRouter.post("/",authorize,createBusiness);

businessRouter.get("/:businessID?",authorize,findBusiness);

businessRouter.patch("/:businessID?",authorize,updateBusiness);


export default businessRouter; 