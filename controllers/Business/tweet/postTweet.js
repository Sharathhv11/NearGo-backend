import businessModel from "../../../models/BusinessModels/business.js";
import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import tweetModel from "../../../models/tweet/tweetModel.js";
import CustomError from "../../../utils/customError.js";
import uploadToCloud from "../../../utils/uploadFiles.js";

const postTweet = handelAsyncFunction(async function (req, res, next) {
  console.log("hereh")
  const { businessId } = req.params;

  if (!businessId) {
    return next(new CustomError(400, `Provide valid businessID.`));
  }

  const business = await businessModel.findById(businessId);

  if (!business) {
    return next(new CustomError(404, `No business exists with ${businessId}.`));
  }

  const { tweet } = req.body;

  const FREE_LIMIT = Number(process.env.BUSINESS_POST_MEDIA_LIMIT_FREE);
  const PAID_LIMIT = Number(process.env.BUSINESS_POST_MEDIA_LIMIT_PAID);

  const isPremiumExpired =
    req.user.account.type === "premium" &&
    req.user.account.expiresAt &&
    req.user.account.expiresAt <= Date.now();


  const mediaCount = req.files?.length || 0;

  

  if (
    ((req.user.account.type === "free" || isPremiumExpired) &&
      mediaCount > FREE_LIMIT) 
  ) {
    return next(
      new CustomError(403, "Upgrade required", {
        code: "SUBSCRIPTION_REQUIRED",
      }),
    );
  }

  if (
    (req.user.account.type === "premium" &&
      !isPremiumExpired &&
      mediaCount > PAID_LIMIT) 
  ) {
    return next(
      new CustomError(403, "media limit reached", {
        code: "PREMIUM_LIMIT_REACHED",
      }),
    );
  }

  if (!tweet || tweet.trim().length === 0) {
    return next(new CustomError(400, "Tweet content is required."));
  }

  
  const media = await uploadToCloud(req.files);

  const validFields = ["tweet", "hashtags", "visibility"];
  for (let key in req.body) {
    if (!validFields.includes(key)) delete req.body[key];
  }

  req.body.postedBy = businessId;
  req.body.media = media;
  const tweetDocument = await tweetModel.create(req.body);

  res.status(201).send({
    status: "success",
    message: "tweet posted successfully.",
    data: tweetDocument,
  });
});

export default postTweet;
