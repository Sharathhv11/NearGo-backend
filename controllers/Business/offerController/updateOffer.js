import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import offerModel from "../../../models/BusinessModels/offers.js";
import businessModel from "../../../models/BusinessModels/business.js";
import CustomError from "../../../utils/customError.js";
import uploadToCloud from "../../../utils/uploadFiles.js"; //* Adjust path
import cleanUpCloud from "../../../utils/cleanUpCloud.js"; //* Adjust path

const updateOffer = handelAsyncFunction(async function (req, res, next) {
  const { businessId, offerId } = req.params;

  //* Fetch business
  const business = await businessModel.findById(businessId);
  if (!business) {
    return next(
      new CustomError(404, `No business exists with given business id.`)
    );
  }

  //* Fetch offer first (for image cleanup)
  const offer = await offerModel.findById(offerId);
  if (!offer || offer.offeringBy.toString() !== businessId) {
    return next(
      new CustomError(
        404,
        "Offer not found or doesn't belong to this business."
      )
    );
  }

  //* Allowed fields
  const updatableFields = [
    "offerName",
    "description",
    "discount",
    "startingDate",
    "endingDate",
  ];
  const filteredUpdate = {};

  //* Filter text fields
  Object.keys(req.body).forEach((key) => {
    if (updatableFields.includes(key)) {
      filteredUpdate[key] = req.body[key];
    }
  });

  //*In updateOffer controller, BEFORE findByIdAndUpdate:
  if (filteredUpdate.startingDate && filteredUpdate.endingDate) {
    const start = new Date(filteredUpdate.startingDate);
    const end = new Date(filteredUpdate.endingDate);
    if (end <= start) {
      return next(
        new CustomError(400, "Ending date must be after starting date")
      );
    }
  }

  //* Handle image update (optional)
  if (req.file) {
    //* Remove old image if exists
    if (offer.image) {
      const cleaned = await cleanUpCloud([offer.image]);
      if (!cleaned) {
        return next(new CustomError(500, "Failed to remove old offer image."));
      }
    }

    //* Upload new image
    const uploadResult = await uploadToCloud([req.file]);
    filteredUpdate.image = uploadResult[0].url;
  }

  //* Nothing to update
  if (!Object.keys(filteredUpdate).length && !req.file) {
    return next(
      new CustomError(400, "No valid offer data provided for update.")
    );
  }

  //* Update offer
  const updatedOffer = await offerModel.findByIdAndUpdate(
    offerId,
    filteredUpdate,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Offer updated successfully.",
    data: updatedOffer,
  });
});

export default updateOffer;
