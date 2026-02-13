import express from "express";
import authorize from "../controllers/authorization.js";
import upload from "../utils/multer.js";

//! importing business controllers
import createBusiness from "../controllers/Business/business/createBusiness.js";
import findBusiness from "../controllers/Business/business/findBusiness.js";
import updateBusiness from "../controllers/Business/business/updateBusiness.js";
import deleteBusiness from "../controllers/Business/business/deleteBusiness.js";

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
import followingStatus from "../controllers/Business/followContollers/followingStatus.js";

const businessRouter = express.Router();

//! near by businesses
businessRouter.get("/nearBy",authorize,localExplore);

//! route for handling the get request of the tweets
businessRouter.get("/:businessId?/tweets", authorize, getTweets);

businessRouter.post("/", authorize, upload.single("profile"), createBusiness);

businessRouter.get("/owned", authorize, getBusinessesOwnedByUser);

businessRouter.get("/:businessID?", authorize, findBusiness);

businessRouter.delete("/:businessID?", authorize,deleteBusiness); 

businessRouter.patch("/:businessID", authorize,upload.single("profile"), updateBusiness);

//! routes for handling the review of the business

businessRouter.post("/:businessId/reviews", authorize, createReview);

businessRouter.patch("/:businessId/reviews/:reviewId", authorize, updateReview);

businessRouter.delete(
  "/:businessId/reviews/:reviewId",
  authorize,
  deleteReview,
);

businessRouter.get("/:businessId/reviews", authorize, getReviews);

//! routes for handling the offer of the business

businessRouter.post(
  "/:businessId/offers",
  authorize,
  upload.single("offerBanner"),
  createOffer,
);

businessRouter.get("/:businessId/offers", authorize, viewOffer);

businessRouter.delete("/:businessId/offers/:offerId", authorize, deleteOffer);

businessRouter.patch(
  "/:businessId/offers/:offerId",
  authorize,
  upload.single("offerBanner"),
  updateOffer,
);

//!business tweets for handling the tweet structure

businessRouter.post(
  "/:businessId/tweets",
  authorize,
  upload.array("media", 5),
  postTweet,
);

businessRouter.delete("/:businessId/tweet/:tweetId", authorize, deleteTweet);
businessRouter.patch("/:businessId/tweet/:tweetId",authorize,updateTweet);

//!follow  routes

businessRouter.post("/:businessId/follow", authorize, following);
businessRouter.delete("/:businessId/follow", authorize, unfollow);
businessRouter.delete(
  "/:businessId/follower/:userId",
  authorize,
  removeFollower,
);
businessRouter.get("/:businessID/follow-status", authorize, followingStatus);

//! businesss media handler
import uploadMedia from "../controllers/Business/business/businessMedia/upload.js";
import getBusinessesOwnedByUser from "../controllers/Business/business/getBusinessOwnedBy.js";
import removeFollower from "../controllers/Business/followContollers/removeFollower.js";
import localExplore from "../controllers/Business/business/Explore.js";
import deleteBusinessMedia from "../controllers/Business/business/businessMedia/delete.js";
import updateTweet from "../controllers/Business/tweet/updateTweet.js";


businessRouter.post(
  "/:businessId/media",
  authorize,
  upload.array("media", 10),
  uploadMedia,
);

businessRouter.delete("/:businessID/media/:url",authorize,deleteBusinessMedia);

export default businessRouter;
