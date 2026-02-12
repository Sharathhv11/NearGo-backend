import handleAsyncFunc from "./../../../../utils/asyncFunctionHandler.js";
import businessModel from "../../../../models/BusinessModels/business.js";
import CustomError from "../../../../utils/customError.js";
import cleanUpCloud from "./../../../../utils/cleanUpCloud.js";
import calculateProfileCompletion from "../../../../utils/profileCompletion.js";

const deleteBusinessMedia = handleAsyncFunc(async (req, res, next) => {
  const { businessID, url } = req.params;

  /*
  ────────────────────────────────
  BUSINESS EXISTENCE + OWNERSHIP
  ────────────────────────────────
  */

  const business = await businessModel.findById(businessID);

  if (!business) {
    return next(
      new CustomError(404, "No business exists with this id.")
    );
  }

  if (business.owner.toString() !== req.user._id.toString()) {
    return next(
      new CustomError(403, "Not authorized to delete media.")
    );
  }

  if (!url) {
    return next(
      new CustomError(400, "Media URL is required.")
    );
  }

  /*
  ────────────────────────────────
  SAFE URL NORMALIZATION
  ────────────────────────────────
  */

  let normalized;

  try {
    normalized = decodeURIComponent(url).trim();
  } catch {
    return next(
      new CustomError(400, "Invalid media URL encoding.")
    );
  }

  /*
  ────────────────────────────────
  FIND ACTUAL STORED URL
  (DB uses encoded format)
  ────────────────────────────────
  */

  const storedUrl = business.media.find((m) => {
    try {
      return decodeURIComponent(m).trim() === normalized;
    } catch {
      return false;
    }
  });

  if (!storedUrl) {
    return next(
      new CustomError(404, "Media not found in business.")
    );
  }

  /*
  ────────────────────────────────
  CLOUD DELETE
  ────────────────────────────────
  */

  const cloudResponse = await cleanUpCloud([storedUrl]);

  if (cloudResponse === false) {
    return next(
      new CustomError(500, "Cloud cleanup failed.")
    );
  }

  /*
  ────────────────────────────────
  REMOVE FROM DB
  ────────────────────────────────
  */

  business.media = business.media.filter(
    (m) => m !== storedUrl
  );

  /*
  ────────────────────────────────
  PROFILE RECALCULATION
  ────────────────────────────────
  */

  business.profileCompletion =
    calculateProfileCompletion(business);

  if (business.profileCompletion < 40) {
    business.profileStage = "basic";
  }

  await business.save();

  /*
  ────────────────────────────────
  RESPONSE
  ────────────────────────────────
  */

  res.status(200).send({
    status: "success",
    message: "Media deleted successfully.",
  });
});

export default deleteBusinessMedia;
