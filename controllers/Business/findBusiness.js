import CustomError from "../../utils/customError.js";
import businessModel from "../../models/BusinessModels/business.js";
import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";

async function locationBased(req, next) {
  const { longitude, latitude, distance, query } = req.body;

  if (!longitude || !latitude || !distance || !query) {
    next(
      new CustomError(
        400,
        "Logitude,latitude,distance and query are required to fetch data."
      )
    );
    return;
  }

  let { limit, page } = req.query;

 limit = parseInt(limit) || 10;
  page = parseInt(page) || 1;
  const skip = (page - 1) * limit;

  const nearbyBusinesses = await businessModel
    .find({
      $and: [
        {
          "location.coordinates": {
            $near: {
              $geometry: { type: "Point", coordinates: [longitude, latitude] },
              $maxDistance: distance,
            },
          },
        },
        {
          $or: [
            { businessName: new RegExp(query, "i") },
            { categories: new RegExp(query, "i") },
            { "location.country": new RegExp(query, "i") },
            { "location.state": new RegExp(query, "i") },
            { "location.district": new RegExp(query, "i") },
            { "location.city": new RegExp(query, "i") },
            { "location.area": new RegExp(query, "i") },
            { "location.pincode": new RegExp(query, "i") },
          ],
        },
      ],
    })
    .skip(skip)
    .limit(limit)
    .populate("owner", "username profilePicture email");

  return nearbyBusinesses;
}

async function globalBased(req, next) {
  const { query } = req.body;

  let { limit, page } = req.query;

  limit = parseInt(limit) || 10;
  page = parseInt(page) || 1;
  const skip = (page - 1) * limit;

  const nearbyBusinesses = await businessModel
    .find({
      $or: [
        { businessName: new RegExp(query, "i") },
        { categories: new RegExp(query, "i") },
        { "location.country": new RegExp(query, "i") },
        { "location.state": new RegExp(query, "i") },
        { "location.district": new RegExp(query, "i") },
        { "location.city": new RegExp(query, "i") },
        { "location.area": new RegExp(query, "i") },
        { "location.pincode": new RegExp(query, "i") },
      ],
    })
    .skip(skip)
    .limit(limit)
    .populate("owner", "username profilePicture email");

  return nearbyBusinesses;
}

const findBusiness = handelAsyncFunction(async (req, res, next) => {
  //^ ?searchType query parameter refers to the type of search that is going on.
  //^ it has 2 options
  //& LocationBased(CaseSensitive) - which accepts longitude, latitude, distance, query and tries to find the nearest business with "distance" distance search query

  //&  GlobalBased(CaseSensitive) - which just require "query" feild and find the business that match to query globally without restriction of the distance

  const { searchType } = req.query;

  if (searchType === "LocationBased") {
    const response = await locationBased(req, next);
    res.status(200).send({
      status: "success",
      count: response.length,
      data: response,
    });
  } else if (searchType === "GlobalBased") {
    const response = await globalBased(req, next);
    res.status(200).send({
      status: "success",
      count: response.length,
      data: response,
    });
  } else {
    next(
      new CustomError(
        400,
        `this route won't operate with '${searchType}' parameter.`
      )
    );
    return;
  }
});

export default findBusiness;
