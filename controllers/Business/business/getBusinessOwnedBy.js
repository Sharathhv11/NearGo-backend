import CustomError from "../../../utils/customError.js";
import businessModel from "../../../models/BusinessModels/business.js";
import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";

const getBusinessesOwnedByUser = handelAsyncFunction(
  async (req, res, next) => {
    const { ownedBy } = req.query;

    //*Validate query param
    if (!ownedBy) {
      return next(
        new CustomError(400, "ownedBy query parameter is required")
      );
    }

    //* Pagination
    let { limit, page } = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    const skip = (page - 1) * limit;

    //*Fetch businesses
    const businesses = await businessModel
      .find({ owner: ownedBy })
      .skip(skip)
      .limit(limit)
      .populate("owner", "username profilePicture email");

    res.status(200).json({
      status: "success",
      count: businesses.length,
      data: businesses,
    });
  }
);

export default getBusinessesOwnedByUser;
