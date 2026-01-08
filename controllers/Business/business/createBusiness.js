import businessModel from "./../../../models/BusinessModels/business.js";
import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import CustomError from "../../../utils/customError.js";
import uploadToCloud from "../../../utils/uploadFiles.js";

//* Allowed image MIME types (DP only)
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

//* Profile completion calculator
const calculateProfileCompletion = (business) => {
  let percent = 20;

  if (business.categories?.length) percent += 15;
  if (business.workingHours?.weekdays?.open) percent += 10;
  if (business.media?.length >= 3) percent += 15;
  if (business.socialLinks?.website) percent += 5;
  if (business.socialLinks?.instagram) percent += 5;
  if (business.verification?.isVerified) percent += 15;

  return Math.min(percent, 100);
};

const createBusiness = handelAsyncFunction(async (req, res, next) => {
  const owner = req.user._id;
  const businessInfo = req.body;

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
          "Invalid file type. Only JPEG, PNG, and WEBP formats are allowed."
        )
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
      id: business._id,
      profileCompletion: business.profileCompletion,
      profileStage: business.profileStage,
      profile: business.profile,
    },
  });
});

export default createBusiness;
