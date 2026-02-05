import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import followersModel from "../../../models/followModels/followers.js";
import followingModel from "../../../models/followModels/following.js";
import businessModel from "../../../models/BusinessModels/business.js";
import CustomError from "../../../utils/customError.js";
import mongoose from "mongoose";

const removeFollower = handelAsyncFunction(async function (req, res, next) {
  const { businessId, userId } = req.params;

  // Convert to ObjectId
  const businessObjectId = new mongoose.Types.ObjectId(businessId);
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Verify business exists and user owns it
  const business = await businessModel.findById(businessObjectId);
  if (!business) {
    return next(new CustomError(404, `No Business exists with ${businessId}.`));
  }

  // Verify business owner
  if (business.owner.toString() !== req.user._id.toString()) {
    return next(new CustomError(403, "Only business owner can remove followers."));
  }

  // **1. Remove from user's following document**
  await followingModel.updateOne(
    { user: userObjectId },
    { $pull: { following: businessObjectId } }
  );

  // **2. Remove from business's followers document** 
  await followersModel.updateOne(
    { business: businessObjectId },
    { $pull: { followers: userObjectId } }  //  CORRECT FIELD: "followers"
  );

  res.status(200).send({
    status: "success",
    message: "Follower removed successfully.",
    data: {
      businessId,
      userId,
      removed: true
    }
  });
});

export default removeFollower;
