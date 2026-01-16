import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import offerModel from "../../../models/BusinessModels/offers.js";
import businessModel from "../../../models/BusinessModels/business.js";
import CustomError from "../../../utils/customError.js";

const viewOffer = handelAsyncFunction(async function (req, res, next) {
  const { businessId } = req.params;

  const business = await businessModel.findById(businessId);
  if (!business) {
    return next(
      new CustomError(404, `No business exists with id ${businessId}.`)
    );
  }

  const currentDate = new Date();
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const resData = await offerModel
    .find({
      offeringBy: businessId,
      endingDate: { $gt: currentDate }
    })
    .limit(limit)
    .skip(limit * (page - 1))
    .sort({ startingDate: 1 })
    .lean();

  res.status(200).json({
    status: "success",
    message: "Successfully fetched offers.",
    data: resData
  });
});


export default viewOffer;