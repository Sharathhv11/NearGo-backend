import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import businessModel from "../../../models/BusinessModels/business.js";
import tweetModel from "../../../models/tweet/tweetModel.js";
import CustomError from "../../../utils/customError.js";
import followingModel from "./../../../models/followModels/following.js";

//tweets need to be suggest based on the
//! location within radius of 10km
//! interest
//!following
//! random

function locationBased(lon, lat, business) {
  console.log();
}

async function followingTweets(userId) {
  const followingBusiness = await followingModel.find({
    user: userId,
  });

  if (followingBusiness.length === 0) {
    return {
      status: "success",
      message: "you are not following any business to show in feed.",
    };
  }

  const tweetsArray = await Promise.all(
    followingBusiness[0].following.map(async (e) => {
      const tweet = await tweetModel.find({
        postedBy: e,
      }).populate("postedBy","businessName email");

      return tweet;
    })
  );

  return tweetsArray;
}

const getTweets = handelAsyncFunction(async function (req, res, next) {
  const { longitude, latitude } = req.body;

  const { page, type } = req.query;

  const skip = page * 10;

  if (type.toLowerCase() === "following") {
    const [tweets] = await followingTweets(req.user._id);
    res.status(200).send({
      status:"success",

      message:"Successfully fetched posts",
      data:[
        ...tweets
      ]
    });
  }

  //location based tweet retreival
});

export default getTweets;
