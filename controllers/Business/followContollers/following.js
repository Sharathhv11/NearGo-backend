import asyncHandler from "./../../../utils/asyncFunctionHandler.js";
import followingModel from "../../../models/followModels/following.js";
import followersModel from "./../../../models/followModels/followers.js";

const following = asyncHandler(async (req, res, next) => { 
  const { businessId } = req.params;
  const userId = req.user._id;

  const userDoc = await followingModel.findOneAndUpdate(
    { user: userId },
    { $addToSet: { following: businessId } },
    { new: true, upsert: true }
  );

  await followersModel.findOneAndUpdate(
    { business: businessId },
    { $addToSet: { followers: userId } },
    { new: true, upsert: true }
  );

  res.status(201).json({
    status: "success",
    message: "Followed successfully",
    data: userDoc,
  });
});


export default following;
