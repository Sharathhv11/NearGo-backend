import asyncHandler from "./../../../utils/asyncFunctionHandler.js";
import followingModel from "../../../models/followModels/following.js";
import followersModel from "../../../models/followModels/followers.js";
import CustomError from "../../../utils/customError.js";

const getFollowList = asyncHandler(async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return next(new CustomError(400, "ID is required in query"));
  }

  // * Check if ID belongs to a USER (Following collection)
  const userFollowing = await followingModel
    .findOne({ user: id })
    .populate("following", "name logo");

  if (userFollowing) {
    return res.status(200).json({
      status: "success",
      type: "user",
      count: userFollowing.following.length,
      data: userFollowing.following,
    });
  }

  // * Check if ID belongs to a BUSINESS (Followers collection)
  const businessFollowers = await followersModel
    .findOne({ business: id })
    .populate("followers", "name profilePic");

  if (businessFollowers) {
    return res.status(200).json({
      status: "success",
      type: "business",
      count: businessFollowers.followers.length,
      data: businessFollowers.followers,
    });
  }

  // * If ID matches neither
  return next(new CustomError(404, "No follow data found for this ID"));
});

export default getFollowList;
