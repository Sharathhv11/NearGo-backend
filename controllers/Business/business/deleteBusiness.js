import businessModel from "./../../../models/BusinessModels/business.js";
import tweetModel from "./../../../models/tweet/tweetModel.js";
import offerModel from "./../../../models/BusinessModels/offers.js";
import reviewModel from "./../../../models/BusinessModels/review.js";
import followingModel from "./../../../models/followModels/following.js";
import followersModel from "./../../../models/followModels/followers.js";

import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import CustomError from "../../../utils/customError.js";
import cleanUpCloud from "../../../utils/cleanUpCloud.js";

const deleteBusiness = handelAsyncFunction(async (req, res, next) => {
  const { businessID } = req.params;

  const business = await businessModel.findById(businessID);

  if( req.user._id.toString() !== business.owner.toString() ){
    return next(new CustomError(403,"Only the business owner is authorized to delete this business."));
  }

  const medias = [];

  if (!business) {
    return next(
      new CustomError(400, `there is no business with id ${businessID}`),
    );
  }

  //* deleting the business
  await businessModel.findOneAndDelete({
    _id: businessID,
  });

  //^ collecting the media urls to delete from cloud
  if (business.profile) medias.push(business.profile);

  business?.media?.forEach((url) => {
    if (url) medias.push(url);
  });

  //! review documents deletion
  await reviewModel.deleteMany({
    BusinessID: businessID,
  });

  const offersToDelete = await offerModel.find({
    offeringBy: businessID,
  });

  offersToDelete.forEach((offer) => {
    if (offer.image) medias.push(offer.image);
  });

  await offerModel.deleteMany({
    offeringBy: businessID,
  });

  const tweetsToDelete = await tweetModel.find({
    postedBy: businessID,
  });
  tweetsToDelete.forEach((tweet) => {
    tweet.media?.forEach(({ url }) => {
      if (url) medias.push(url);
    });
  });

  await tweetModel.deleteMany({
    postedBy: businessID,
  });

  await followersModel.findOneAndDelete({ business: businessID });

  const followers = await followingModel.find({
    following: businessID,
  });

  await Promise.all(
    followers.map((follower) =>
      followingModel.findByIdAndUpdate(follower._id, {
        $pull: { following: businessID },
      }),
    ),
  );

  await cleanUpCloud(medias);

  res.status(200).send({
    status: "success",
    message: "business deleted successfully.",
  });
});

export default deleteBusiness;
