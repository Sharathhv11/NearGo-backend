import businessModel from "./../../../models/BusinessModels/business.js";
import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import CustomError from "../../../utils/customError.js";
import uploadToCloud from "../../../utils/uploadFiles.js";
import calculateProfileCompletion from "../../../utils/profileCompletion.js";

//* Allowed image MIME types (DP only)
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

//* Profile completion calculator


const createBusiness = handelAsyncFunction(async (req, res, next) => {
  const owner = req.user._id;
  const businessInfo = req.body;

  //^IF USER IS HAVING FREE TIER ACCOUNT NEED TO RESTRICT HIM FROM REGISTERING MORE THAN FREE ACCOUNT BUSINESS LIMIT
  const businessOwnedByUser = await businessModel.find({
    owner,
  });

  const FREE_LIMIT = Number(process.env.BUSINESS_REG_LIMIT_FREE);
  const PAID_LIMIT = Number(process.env.BUSINESS_REG_LIMIT_PAID);

  const isPremiumExpired =
    req.user.account.type === "premium" &&
    req.user.account.expiresAt &&
    req.user.account.expiresAt <= Date.now();

  if (
    (req.user.account.type === "free" || isPremiumExpired) &&
    businessOwnedByUser.length >= FREE_LIMIT
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
    businessOwnedByUser.length >= PAID_LIMIT
  ) {
    return next(
      new CustomError(403, "Business limit reached", {
        code: "PREMIUM_LIMIT_REACHED",
      }),
    );
  }

  if (!Object.keys(businessInfo).length) {
    return next(new CustomError(400, "Business information is required."));
  }

  //* Upload business DP (SINGLE image)
  let profileImage = null;

  if (req.file) {
    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      return next(
        new CustomError(
          400,
          "Invalid file type. Only JPEG, PNG, and WEBP formats are allowed.",
        ),
      );
    }

    const uploadResult = await uploadToCloud([req.file]);
    profileImage = uploadResult[0].url;
  }

  //* Create business (media stays empty)
  const business = await businessModel.create({
    ...businessInfo,
    owner,
    profile: profileImage,
    profileStage: "basic",
    status: "Closed",
  });

  //* Calculate profile completion (still 20%)
  business.profileCompletion = calculateProfileCompletion(business);

  //* Update stage if needed (future-proof)
  if (business.profileCompletion >= 40) {
    business.profileStage = "details";
  }

  await business.save();

  res.status(201).json({
    status: "success",
    message: "Business registered successfully.",
    data: {
      ...business._doc,
    },
  });
});

export default createBusiness;
