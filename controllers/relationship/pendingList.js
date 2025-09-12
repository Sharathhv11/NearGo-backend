import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";
import CustomError from "../../utils/customError.js";
import Relationship from "../../models/relationShipSchema.js";

const getPendingRequests = handelAsyncFunction(async (req, res, next) => {
  const { userId } = req.params;

  const requests = await Relationship.find({
    receiver: userId,
    status: "pending",
  }).populate("requester", "username email");

  res.status(200).json({
    status: "success",
    results: requests.length,
    data: requests,
  });
});

export default getPendingRequests;