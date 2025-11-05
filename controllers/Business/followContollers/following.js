import asyncHandler from "./../../../utils/asyncFunctionHandler.js";
import followingModel from "../../../models/followModels/following.js";
import followersModel from "./../../../models/followModels/followers.js";

const following = asyncHandler(async (req, res, next) => {
  const { businessId } = req.params;

  const businessDoc = await followersModel.findOneAndUpdate(
    { business: businessId }, 
    { $push: { followers: req.user._id } },
    { new: true, upsert: true } 
  );

  const userDoc = await followingModel.findOneAndUpdate(
    { user: req.user._id }, 
    { $push: { following: businessId } },
    { new: true, upsert: true } 
  );

  res.status(201).send(
    {
      status :"success",
      message :"follow sent successfully.",
      data :{
        ...userDoc
      }
    }
  )
});

export default following;
