import userModel from "../../models/userModel.js";
import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";
import CustomError from "../../utils/customError.js";
import uploadToCloud from "../../utils/uploadFiles.js";
import cleanUpCloud from "../../utils/cleanUpCloud.js";

// Allowed image MIME types
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const addProfile = handelAsyncFunction(async function (req, res, next) {
  const userId = req.user._id;

  if (!req.file) {
    return next(new CustomError(400, "No profile image uploaded."));
  }

  if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
    return next(
      new CustomError(
        400,
        "Invalid file type. Only JPEG, PNG, and WEBP formats are allowed."
      )
    );
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return next(new CustomError(404, `No user exists with the user-ID ${userId}.`));
  }

  const DEFAULT_DP =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  if (user.profilePicture && user.profilePicture !== DEFAULT_DP) {
    const result = await cleanUpCloud([user.profilePicture]);
    if( !result )return next(new CustomError(500,"Something went wrong please try again."));
  }

  const uploadResult = await uploadToCloud([req.file]);
  const newProfileURL = uploadResult[0].url;

  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    { profilePicture: newProfileURL },
    { new: true }
  );

  res.status(201).send({
    status: "success",
    message: "Profile updated successfully.",
    data: updatedUser,
  });
});

export default addProfile;
