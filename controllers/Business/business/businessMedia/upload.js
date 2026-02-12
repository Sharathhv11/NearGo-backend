import handleAsyncFunc from "./../../../../utils/asyncFunctionHandler.js";
import businessModel from "../../../../models/BusinessModels/business.js";
import CustomError from "../../../../utils/customError.js";
import uploadToCloud from "./../../../../utils/uploadFiles.js";
import calculateProfileCompletion from "../../../../utils/profileCompletion.js";

const uploadMedia = handleAsyncFunc(async function (req, res, next) {
  const { businessId } = req.params;

  const business = await businessModel.findById(businessId);
  if (!business) {
    return next(
      new CustomError(404, `No business exists with the id ${businessId}.`),
    );
  }

  if (business.owner.toString() !== req.user._id.toString()) {
    return next(
      new CustomError(
        403,
        "Only the business owner is permitted to upload media.",
      ),
    );
  }

  if (!req.files || req.files.length === 0) {
    return next(new CustomError(400, "No media file was sent for upload."));
  }

  // Same subscription logic as postTweet
  const FREE_LIMIT = Number(process.env.BUSINESS_MEDIA_UPLOAD_LIMIT_FREE);
  const PAID_LIMIT = Number(process.env.BUSINESS_MEDIA_UPLOAD_LIMIT_PAID);

  const isPremiumExpired =
    req.user.account.type === "premium" &&
    req.user.account.expiresAt &&
    req.user.account.expiresAt <= Date.now();

  const mediaCount = business.media.length;

  if (
    (req.user.account.type === "free" || isPremiumExpired) &&
    mediaCount >= FREE_LIMIT
  ) {
    return next(
      new CustomError(403, "Upgrade required", {
        code: "SUBSCRIPTION_REQUIRED",
      }),
    );
  }

  if (
    req.user.account.type === "premium" &&
    !isPremiumExpired &&
    mediaCount >= PAID_LIMIT
  ) {
    return next(
      new CustomError(403, "media limit reached", {
        code: "PREMIUM_LIMIT_REACHED",
      }),
    );
  }

  // Existing total media limit check (business.media.length)
  const used = business.media.length;
  const TOTAL_LIMIT =
    req.user.account.type === "free" || isPremiumExpired
      ? FREE_LIMIT
      : PAID_LIMIT;

  if (used >= TOTAL_LIMIT) {
    return next(
      new CustomError(
        400,
        `You have already reached the max upload limit of ${TOTAL_LIMIT} files.`,
      ),
    );
  }

  const remaining = TOTAL_LIMIT - used;
  const filesToUpload = req.files.slice(0, remaining);

  const urls = (await uploadToCloud(filesToUpload)).map((f) => f.url.trim());

  const updatedBusiness = await businessModel.findByIdAndUpdate(
    businessId,
    { $push: { media: { $each: urls } } },
    { new: true },
  );

  updatedBusiness.profileCompletion =
    calculateProfileCompletion(updatedBusiness);

  // optional stage update (same logic as your other controller)
  if (updatedBusiness.profileCompletion >= 40) {
    updatedBusiness.profileStage = "details";
  }

  await updatedBusiness.save();

  res.status(201).send({
    status: "success",
    message: "Media uploaded successfully.",
    data: updatedBusiness,
  });
});

export default uploadMedia;
