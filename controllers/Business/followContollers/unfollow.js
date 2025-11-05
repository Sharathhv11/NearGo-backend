import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import followersModel from "../../../models/followModels/followers.js";
import followingModel from "../../../models/followModels/following.js";
import businessModel from "../../../models/BusinessModels/business.js";
import CustomError from "../../../utils/customError.js";


const unfollow = handelAsyncFunction(async function (req, res, next) {
  const { businessId } = req.params;

  const business = await businessModel.findById(businessId);

  if (!business) {
    return next(new CustomError(401, `No Business exists with ${businessId}.`));
  }

  const unFollowBusinessDoc = await followersModel.findOneAndDelete({
        business: businessId
  });

  const unFolloingUserDocument = await followingModel.findOneAndDelete({
    user:req.user._id
  });


  res.status(200).send({
    status:"success",
    message :"unfollowed successfully."
  });


});

export default unfollow;
