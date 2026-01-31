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

async function randomTweets(lon, lat, user, page, limit, distance, next) {
  const { interest } = user;

  const longitude = Number(lon);
  const latitude = Number(lat);

  if (isNaN(longitude) || isNaN(latitude)) {
    return next(new CustomError(400, "Invalid coordinates for random fetch."));
  }

  const businesses = (
    await businessModel
      .find({
        categories: { $in: interest },
      })
      .skip((page - 1) * limit)
      .limit(limit)
  ).map((e) => e._id);

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const tweetsArray = await Promise.all(
    businesses.map(async (e) => {
      const tweet = await tweetModel
        .find({
          postedBy: e,
          createdAt: { $gt: lastMonth },
        })
        .populate("postedBy", "businessName email profile");

      return tweet;
    }),
  );

  const businessNear = (
    await businessModel
      .find({
        "location.coordinates": {
          $near: {
            $geometry: { type: "Point", coordinates: [longitude, latitude] },
            $maxDistance: distance || 10000,
          },
        },
      })
      .skip((page - 1) * limit)
      .limit(limit)
  ).map((e) => e._id);

  const nearTweets = await Promise.all(
    businessNear.map(async (e) => {
      const tweet = await tweetModel
        .find({
          postedBy: e,
          createdAt: { $gt: lastMonth },
        })
        .populate("postedBy", "businessName email profile");

      return tweet;
    }),
  );

  const tweetResult = [...tweetsArray, ...nearTweets];

  const flat = tweetResult.flat();

  const uniqueTweets = [
    ...new Map(flat.map((t) => [t._id.toString(), t])).values(),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return uniqueTweets;
}

async function followingTweets(userId, page, limit) {
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
      const tweet = await tweetModel
        .find({
          postedBy: e,
        })
        .sort({
          createdAt: -1,
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("postedBy", "businessName email profile");

      return tweet;
    }),
  );

  return tweetsArray;
}

const getTweets = handelAsyncFunction(async function (req, res, next) {
  const { page = 1, type, limit = 10, distance } = req.query;
  const { businessId } = req.params;

  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const skip = (parsedPage - 1) * parsedLimit;

  //^ BUSINESS TWEETS
  if (businessId) {
    const [tweets, totalTweets] = await Promise.all([
      tweetModel
        .find({ postedBy : businessId })
        .populate("postedBy", "businessName email profile")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit),

      tweetModel.countDocuments({  postedBy : businessId }),
    ]);


    return res.status(200).json({
      status: "success",
      message: "Business tweets fetched successfully",
      data: tweets,
      totalTweets,
      totalPages: Math.ceil(totalTweets / parsedLimit),
      currentPage: parsedPage,
    });
  }

  // ^ FOLLOWING TWEETS
  if (type?.toLowerCase() === "following") {
    const [tweets] = await followingTweets(
      req.user._id,
      parsedPage,
      parsedLimit,
    );

    return res.status(200).send({
      status: "success",
      message: "Successfully fetched posts",
      data: tweets,
    });
  }

  //^  RANDOM / LOCATION TWEETS
  const { longitude, latitude } = req.body;

  const ranTweets = await randomTweets(
    longitude,
    latitude,
    req.user,
    parsedPage,
    parsedLimit,
    distance,
    next,
  );

  res.status(200).send({
    status: "success",
    message: "Tweets fetched successfully",
    data: ranTweets,
  });
});

export default getTweets;
