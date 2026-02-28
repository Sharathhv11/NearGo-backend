import userModel from "../../models/userModel.js";
import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";
import CustomError from "../../utils/customError.js";
import uploadToCloud from "../../utils/uploadFiles.js";
import cleanUpCloud from "../../utils/cleanUpCloud.js";

// Allowed image MIME types
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const updateUserProfile = handelAsyncFunction(async (req, res, next) => {
  const userId = req.user._id;
  const updates = req.body;

  const {userId:userIDParams} = req.params;


  if( userId.toString() !== userIDParams ){
      return next(new CustomError(403,"unAuthorized to update profile."));
  }

  //Allowed profile fields
  const updatableFields = ["name", "username", "phone_no", "interest"];

  const filteredUpdate = {};

  //Filter text fields
  Object.keys(updates).forEach((key) => {
    if (updatableFields.includes(key)) {
      filteredUpdate[key] = updates[key];
    }
  });

  //Fetch user
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new CustomError(404, "User not found."));
  }

  //Handle profile image (optional)
  if (req.file) {
    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      return next(
        new CustomError(
          400,
          "Invalid file type. Only JPEG, PNG, and WEBP formats are allowed.",
        ),
      );
    }

    //Remove old image if not default
    if (user.profilePicture && !user.profilePicture) {
      //! verifying weather profile comes from google
      if (req.user.profileImageSource !== "google") {
        const cleaned = await cleanUpCloud([user.profilePicture]);
        if (!cleaned) {
          return next(
            new CustomError(500, "Failed to remove old profile image."),
          );
        }
      }
    } 

    //Upload new image
    const uploadResult = await uploadToCloud([req.file]);
    filteredUpdate.profilePicture = uploadResult[0].url;
  }

  //Nothing to update
  if (!Object.keys(filteredUpdate).length) {
    return next(
      new CustomError(400, "No valid profile data provided for update."),
    );
  }

  filteredUpdate.profileCompleted = true;

  //Update user
  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    filteredUpdate,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully.",
    data: updatedUser,
  });
});

export default updateUserProfile;
