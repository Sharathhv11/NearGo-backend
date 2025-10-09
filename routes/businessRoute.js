import express from "express";
import authorize from "../controllers/authorization.js";

//! importing business controllers 
import createBusiness from "../controllers/Business/createBusiness.js";
import findBusiness from "../controllers/Business/findBusiness.js";
import updateBusiness from "../controllers/Business/updateBusiness.js";


//!importing review controllers
import {
    createReview,
    updateReview,
    deleteReview,
    getReviews
 } from "./../controllers/Business/reviewController.js"



const businessRouter = express.Router();


businessRouter.post("/",authorize,createBusiness);

businessRouter.get("/:businessID?",authorize,findBusiness);

businessRouter.patch("/:businessID",authorize,updateBusiness);

//! routes for handling the review of the business

businessRouter.post("/:businessId/reviews",authorize,createReview);

businessRouter.patch("/:businessId/reviews/:reviewId",authorize,updateReview);

businessRouter.delete("/:businessId/reviews/:reviewId",authorize,deleteReview);

businessRouter.get ("/:businessId/reviews",authorize,getReviews);


export default businessRouter; 