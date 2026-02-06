import CustomError from "../../../utils/customError.js";
import businessModel from "../../../models/BusinessModels/business.js";
import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";

const localExplore = handelAsyncFunction(async (req, res, next) => {
  let { longitude, latitude, distance } = req.query;

  // Location coordinates are required for local explore
  if (!longitude || !latitude || !distance) {
    return next(
      new CustomError(
        400,
        "Longitude, latitude, and distance are required for local explore.",
      ),
    );
  }

  longitude = Number(longitude);
  latitude = Number(latitude);
  distance = Number(distance);

  if (isNaN(longitude) || isNaN(latitude) || isNaN(distance)) {
    return next(new CustomError(400, "Invalid coordinates or distance"));
  }

  let { limit, page } = req.query;
  limit = parseInt(limit) || 10;
  page = parseInt(page) || 1;
  const skip = (page - 1) * limit;

  const nearbyBusinesses = await businessModel
    .find({
      "location.coordinates": {
        $near: {
          $geometry: { type: "Point", coordinates: [latitude, longitude] },
          $maxDistance: distance,
        },
      },
    })
    .skip(skip)
    .limit(limit)
    .populate("owner", "username profilePicture email")
    .lean();

  res.status(200).send({
    status: "success",
    message: "Businesses fetched successfully",
    data: nearbyBusinesses,
  });
});

export default localExplore;
