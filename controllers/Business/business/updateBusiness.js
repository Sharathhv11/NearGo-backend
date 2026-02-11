import businessModel from "../../../models/BusinessModels/business.js";
import handleAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import CustomError from "../../../utils/customError.js";
import calculateProfileCompletion from "../../../utils/profileCompletion.js";
import uploadToCloud from "../../../utils/uploadFiles.js";
import cleanUpCloud from "../../../utils/cleanUpCloud.js";

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  UPDATE BUSINESS CONTROLLER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const updateBusiness = handleAsyncFunction(async (req, res, next) => {
  const { businessID } = req.params;

  if (!businessID) {
    return next(new CustomError(400, "Business ID required."));
  }

  const business = await businessModel.findById(businessID);

  if (!business) {
    return next(new CustomError(404, "Business not found."));
  }

  /*
  ────────────────────────────────
  OWNER SECURITY CHECK
  ────────────────────────────────
  */

  if (business.owner.toString() !== req.user._id.toString()) {
    return next(
      new CustomError(403, "You are not authorized to update this business."),
    );
  }

  /*
  ────────────────────────────────
  ALLOWED FIELDS
  ────────────────────────────────
  */

  const allowedFields = [
    "businessName",
    "description",
    "email",
    "status",
    "categories",
    "socialLinks",
  ];

  const updates = req.body;
  const filtered = {};

  /*
  ────────────────────────────────
  SIMPLE FIELD FILTERING
  ────────────────────────────────
  */

  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key)) {
      filtered[key] = updates[key];
    }
  });

  /*
  ────────────────────────────────
  CATEGORY LIMIT + VALIDATION
  ────────────────────────────────
  */

  if (filtered.categories) {
    const cats = Array.isArray(filtered.categories)
      ? filtered.categories
      : [filtered.categories];

    if (cats.length > 5) {
      return next(new CustomError(400, "Maximum 5 categories allowed."));
    }

    business.categories = cats;
  }

  /*
  ────────────────────────────────
  SOCIAL LINKS MERGE
  ────────────────────────────────
  */

  if (filtered.socialLinks) {
    try {
      const parsed =
        typeof filtered.socialLinks === "string"
          ? JSON.parse(filtered.socialLinks)
          : filtered.socialLinks;

      business.socialLinks = {
        ...business.socialLinks,
        ...parsed,
      };
    } catch {
      return next(new CustomError(400, "Invalid socialLinks format."));
    }
  }

  /*
  ────────────────────────────────
  LOCATION UPDATE (GEO SAFE)
  ────────────────────────────────
  */

  if (updates.location) {
    const loc = updates.location;

    business.location = {
      ...business.location.toObject(),
      ...loc,
    };

    if (loc.coordinates && Array.isArray(loc.coordinates.coordinates)) {
      business.location.coordinates = {
        type: "Point",
        coordinates: loc.coordinates.coordinates,
      };
    }
  }

  /*
  ────────────────────────────────
  PHONE UPDATE
  ────────────────────────────────
  */

  if (updates.phoneNo) {
    business.phoneNo = updates.phoneNo;
  }

  /*
────────────────────────────────
PROFILE IMAGE UPDATE (Cloud Safe)
────────────────────────────────
*/

  if (req.file) {
    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      return next(
        new CustomError(
          400,
          "Invalid file type. Only JPEG, PNG, and WEBP formats are allowed.",
        ),
      );
    }

    // Remove old image if exists
    if (business.profile) {
      const cleaned = await cleanUpCloud([business.profile]);

      if (!cleaned) {
        return next(
          new CustomError(500, "Failed to remove old business profile image."),
        );
      }
    }

    // Upload new image
    const uploadResult = await uploadToCloud([req.file]);

    business.profile = uploadResult[0].url;
  }

  /*
  ────────────────────────────────
  SIMPLE FIELD ASSIGNMENT
  ────────────────────────────────
  */

  ["businessName", "description", "email", "status"].forEach((field) => {
    if (filtered[field] !== undefined) {
      business[field] = filtered[field];
    }
  });

  /*
  ────────────────────────────────
  SAVE WITH VALIDATION
  ────────────────────────────────
  */

  // Recalculate profile completion
  business.profileCompletion = calculateProfileCompletion(business);

  // Update stage
  if (business.profileCompletion >= 40) {
    business.profileStage = "details";
  }

  await business.save();

  res.status(200).json({
    status: "success",
    message: "Business updated successfully.",
    data: business,
  });
});

export default updateBusiness;
