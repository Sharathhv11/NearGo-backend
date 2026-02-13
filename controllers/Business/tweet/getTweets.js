import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import businessModel from "../../../models/BusinessModels/business.js";
import tweetModel from "../../../models/tweet/tweetModel.js";
import CustomError from "../../../utils/customError.js";
import followingModel from "./../../../models/followModels/following.js";

async function randomTweets(lon, lat, user, page, limit, distance) {
  const { interest } = user;

  const longitude = Number(lon);
  const latitude = Number(lat);

  const businesses = (
    await businessModel
      .find({ categories: { $in: interest } })
      .skip((page - 1) * limit)
      .limit(limit)
  ).map((e) => e._id);

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const interestTweets = await Promise.all(
    businesses.map(async (e) =>
      tweetModel
        .find({
          postedBy: e,
          createdAt: { $gt: lastMonth },
        })
        .populate("postedBy", "businessName email profile")
        .populate("likes", "email username  profilePicture")
        .populate({
          path: "replies",
          populate: {
            path: "userId",
            select: "email username profilePicture",
          },
        }),
    ),
  );

  let nearTweets = [];
  if (!isNaN(longitude) && !isNaN(latitude)) {
    const businessNear = (
      await businessModel
        .find({
          "location.coordinates": {
            $near: {
              $geometry: { type: "Point", coordinates: [lat, lon] },
              $maxDistance: distance || 10000,
            },
          },
        })
        .skip((page - 1) * limit)
        .limit(limit)
    ).map((e) => e._id);
    nearTweets = await Promise.all(
      businessNear.map(async (e) =>
        tweetModel
          .find({
            postedBy: e,
            createdAt: { $gt: lastMonth },
          })
          .populate("postedBy", "businessName email profile")
          .populate("likes", "email username  profilePicture")
          .populate({
          path: "replies",
          populate: {
            path: "userId",
            select: "email username profilePicture",
          },
        }),
      ),
    );
  }

  const flatTweets = [...interestTweets, ...nearTweets].flat();

  const uniqueTweets = [
    ...new Map(flatTweets.map((t) => [t._id.toString(), t])).values(),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return uniqueTweets;
}

async function followingTweets(userId, page, limit) {
  const followingBusiness = await followingModel.findOne({ user: userId });

  if (!followingBusiness || followingBusiness.following.length === 0) {
    throw new CustomError(
      200,
      "You are not following any business to show in feed.",
    );
  }

  const tweets = await Promise.all(
    followingBusiness.following.map(async (e) =>
      tweetModel
        .find({ postedBy: e })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("postedBy", "businessName email profile")
        .populate("likes", "email username  profilePicture")
        .populate({
          path: "replies",
          populate: {
            path: "userId",
            select: "email username profilePicture",
          },
        }),
    ),
  );

  return tweets.flat();
}

const getTweets = handelAsyncFunction(async (req, res) => {
  const { page = 1, type, limit = 10, distance } = req.query;
  const { businessId } = req.params;

  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const skip = (parsedPage - 1) * parsedLimit;

  if (businessId) {
    const [tweets, totalTweets] = await Promise.all([
      tweetModel
        .find({ postedBy: businessId })
        .populate("postedBy", "businessName email profile")
         .populate("likes", "email username  profilePicture")
        .populate({
          path: "replies",
          populate: {
            path: "userId",
            select: "email username profilePicture",
          }})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit),

      tweetModel.countDocuments({ postedBy: businessId }),
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

  if (type?.toLowerCase() === "following") {
    const tweets = await followingTweets(req.user._id, parsedPage, parsedLimit);

    return res.status(200).json({
      status: "success",
      message: "Successfully fetched posts",
      data: tweets,
    });
  }

  const { longitude, latitude } = req.query;

  const ranTweets = await randomTweets(
    longitude,
    latitude,
    req.user,
    parsedPage,
    parsedLimit,
    distance,
  );

  return res.status(200).json({
    status: "success",
    message: "Tweets fetched successfully",
    data: ranTweets,
  });
}); 

export default getTweets;
