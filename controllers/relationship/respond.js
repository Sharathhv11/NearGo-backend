import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";
import CustomError from "../../utils/customError.js";
import Relationship from "../../models/relationshipSchema.js";


const respondToRequest = handelAsyncFunction(async (req, res, next) => {
  const { status } = req.body;

  if (!["accepted", "rejected", "blocked"].includes(status)) {
    return next(new CustomError(400, "Invalid status."));
  }

  const relation = await Relationship.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!relation) {
    return next(new CustomError(404, "Relationship not found."));
  }

  res.status(200).json({
    status: "success",
    message: `Request has been ${status}.`,
    data: relation,
  });
});

export default respondToRequest;