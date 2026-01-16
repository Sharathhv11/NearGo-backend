import express from "express";
import authorize from "../controllers/authorization.js";
import upload from "../utils/multer.js";

//! importing business controllers
import createBusiness from "../controllers/Business/business/createBusiness.js";
import findBusiness from "../controllers/Business/business/findBusiness.js";
import updateBusiness from "../controllers/Business/business/updateBusiness.js";

//!importing review controllers
import {
  createReview,
  updateReview,
  deleteReview,
  getReviews,
} from "./../controllers/Business/reviewController.js";

//! importing offer controllers

import createOffer from "../controllers/Business/offerController/createOffer.js";
import viewOffer from "../controllers/Business/offerController/viewOffer.js";
import deleteOffer from "../controllers/Business/offerController/deleteOffer.js";
import updateOffer from "../controllers/Business/offerController/updateOffer.js";

//! importing tweet controllers
import postTweet from "../controllers/Business/tweet/postTweet.js";
import deleteTweet from "../controllers/Business/tweet/deleteTweet.js";
import getTweets from "../controllers/Business/tweet/getTweets.js";

//!import follow controllers
import following from "../controllers/Business/followContollers/following.js";
import unfollow from "../controllers/Business/followContollers/unfollow.js";

 
const businessRouter = express.Router();

//! route for handling the get request of the tweets
businessRouter.get("/:businessId?/tweets", authorize, getTweets);

businessRouter.post("/", authorize,upload.single("profile"), createBusiness);

businessRouter.get("/", authorize, getBusinessesOwnedByUser);

businessRouter.get("/:businessID?", authorize, findBusiness);

businessRouter.patch("/:businessID", authorize, updateBusiness);

//! routes for handling the review of the business

businessRouter.post("/:businessId/reviews", authorize, createReview);

businessRouter.patch("/:businessId/reviews/:reviewId", authorize, updateReview);

businessRouter.delete(
  "/:businessId/reviews/:reviewId",
  authorize,
  deleteReview
);

businessRouter.get("/:businessId/reviews", authorize, getReviews);

//! routes for handling the offer of the business

businessRouter.post("/:businessId/offers", authorize,upload.single("offerBanner"), createOffer);

businessRouter.get("/:businessId/offers", authorize, viewOffer);

businessRouter.delete("/:businessId/offers/:offerId", authorize, deleteOffer);

businessRouter.patch("/:businessId/offers/:offerId", authorize,upload.single("offerBanner"), updateOffer);

//!business tweets for handling the tweet structure

businessRouter.post(
  "/:businessId/tweets",
  authorize,
  upload.array("media", 10),
  postTweet
);

businessRouter.delete("/:businessId/tweets/:tweetId", authorize, deleteTweet);

//!follow  routes

businessRouter.post("/:businessId/follow", authorize, following);
businessRouter.delete("/:businessId/follow", authorize, unfollow);

//! businesss media handler
import uploadMedia from "../controllers/Business/business/businessMedia/upload.js";
import getBusinessesOwnedByUser from "../controllers/Business/business/getBusinessOwnedBy.js";
businessRouter.post(
  "/:businessId/media",
  authorize,
  upload.array("media", 10),
  uploadMedia
);

export default businessRouter;
