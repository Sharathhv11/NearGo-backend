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


//! importing offer controllers

import createOffer from "../controllers/Business/offerController/createOffer.js";
import viewOffer from "../controllers/Business/offerController/viewOffer.js";
import deleteOffer from "../controllers/Business/offerController/deleteOffer.js";
import updateOffer from "../controllers/Business/offerController/updateOffer.js";


//! importing tweet controllers
import postTweet from "../controllers/Business/tweet/postTweet.js";

const businessRouter = express.Router();


businessRouter.post("/",authorize,createBusiness);

businessRouter.get("/:businessID?",authorize,findBusiness);

businessRouter.patch("/:businessID",authorize,updateBusiness);

//! routes for handling the review of the business

businessRouter.post("/:businessId/reviews",authorize,createReview);

businessRouter.patch("/:businessId/reviews/:reviewId",authorize,updateReview);

businessRouter.delete("/:businessId/reviews/:reviewId",authorize,deleteReview);

businessRouter.get ("/:businessId/reviews",authorize,getReviews);

//! routes for handling the offer of the business

businessRouter.post("/:businessId/offers",authorize,createOffer);

businessRouter.get("/:businessId/offers",authorize,viewOffer);

businessRouter.delete("/:businessId/offers/:offerId",authorize,deleteOffer);

businessRouter.patch("/:businessId/offers/:offerId",authorize,updateOffer);

//!business tweets for handling the tweet structure

businessRouter.post("/:businessId/tweet",authorize,postTweet);

export default businessRouter; 