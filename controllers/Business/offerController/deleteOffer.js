import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import offerModel from "../../../models/BusinessModels/offers.js";
import businessModel from "../../../models/BusinessModels/business.js";
import CustomError from "../../../utils/customError.js";
import cleanUpCloud from "../../../utils/cleanUpCloud.js"; //*  ADDED

const deleteOffer = handelAsyncFunction(async function(req, res, next) {
  const { businessId, offerId } = req.params;

  //* Fetch business (same as update)
  const business = await businessModel.findById(businessId);
  if (!business) {
    return next(new CustomError(404, "No business exists with given businessID."));
  }

  //* Fetch offer FIRST (for image cleanup)  SAME AS UPDATE
  const offer = await offerModel.findById(offerId);
  if (!offer || offer.offeringBy.toString() !== businessId) {
    return next(new CustomError(404, "Offer not found or doesn't belong to this business."));
  }

  //*  NEW: Clean up offer image if exists
  if (offer.image) {
    const cleaned = await cleanUpCloud([offer.image]);
    if (!cleaned) {
      return next(new CustomError(500, "Failed to remove offer image."));
    }
  }

  //* Delete offer (AFTER image cleanup)
  const deletedOffer = await offerModel.findByIdAndDelete(offerId);

  res.status(200).json({  //  Made consistent with updateOffer
    status: "success",
    message: "Offer deleted successfully.",
    data: deletedOffer // Optional: return deleted data
  });
});

export default deleteOffer;
