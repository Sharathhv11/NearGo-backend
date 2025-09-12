import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";
import CustomError from "../../utils/customError.js";
import Relationship from "../../models/relationShipSchema.js";



const sendRequest = handelAsyncFunction(async (req, res, next) => {
  const { requester, receiver } = req.body;

  if (!requester || !receiver) {
    return next(new CustomError(400, "Requester and Receiver are required."));
  }

  if (requester === receiver) {
    return next(new CustomError(400, "You cannot send request to yourself."));
  }

  // prevent duplicate
  const existing = await Relationship.findOne({ requester, receiver });
  if (existing) {
    return next(new CustomError(400, "Relationship already exists."));
  }

  const relation = await Relationship.create({ requester, receiver });

  res.status(201).json({
    status: "success",
    message: "Request sent successfully.",
    data: relation,
  });
});


export default sendRequest;