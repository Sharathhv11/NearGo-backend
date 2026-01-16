import offerModel from "../../../models/BusinessModels/offers.js";
import asyncHandler from "./../../../utils/asyncFunctionHandler.js";
import businessModel from "../../../models/BusinessModels/business.js";
import CustomError from "../../../utils/customError.js";
import uploadToCloud from "../../../utils/uploadFiles.js"; //  ADD

// ADD (same pattern as business DP)
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const createOffer = asyncHandler(async function (req, res, next) {
  const { businessId } = req.params;

  const isBusinessExists = await businessModel.findById(businessId);

  if (!isBusinessExists) {
    return next(
      new CustomError(404, `no business exists with id ${businessId}`)
    );
  }

  if (Object.keys(req.body).length == 0) {
    return next(
      new CustomError(400, "No data provided for posting offer.")
    );
  }

  const filteredBody = {};
  const validFields = [
    "offeringBy",
    "offerName",
    "description",
    "discount",
    "startingDate",
    "endingDate",
  ];

  for (let key in req.body) {
    if (validFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  }

  if (Object.keys(filteredBody).length == 0) {
    return next(
      new CustomError(400, "No valid fields provided for posting offer.")
    );
  }

  filteredBody.offeringBy = businessId;

  // ===========================
  // ADD IMAGE UPLOAD LOGIC
  // ===========================
  let offerImage = null;

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
    offerImage = uploadResult[0].url;
    filteredBody.image = offerImage; // optional field
  }

  const offer = await offerModel.create(filteredBody);

  res.status(201).send({
    status: "success",
    message: `offer posted successfully and will go live on ${filteredBody.startingDate} and ends on ${filteredBody.endingDate}`,
    data: offer,
  });
});

export default createOffer;
