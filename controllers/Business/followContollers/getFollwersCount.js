import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import CustomError from "../../../utils/customError.js";
import followersModel from "../../../models/followModels/followers.js";
import followingModel from "../../../models/followModels/following.js";

const getFollowCount = handelAsyncFunction(async (req, res, next) => {
  // ^ ensure either userID or businessID is provided
  const { userID, businessID } = req.query;

  if (!userID && !businessID) {
    return next(
      new CustomError(400, "query parameter is missing (userID or businessID)")
    );
  }

  let count = 0;

  // ^ USER → following count
  if (userID) {
    const userFollowDoc = await followingModel.findOne({ user: userID });

    count = userFollowDoc ? userFollowDoc.following.length : 0;
  }

  // ^ BUSINESS → followers count
  if (businessID) {
    const businessFollowDoc = await followersModel.findOne({
      business: businessID,
    });

    count = businessFollowDoc ? businessFollowDoc.followers.length : 0;
  }

  res.status(200).send({
    status: "success",
    message: "count fetched successfully",
    data: {
      count,
    },
  });
});

export default getFollowCount;
