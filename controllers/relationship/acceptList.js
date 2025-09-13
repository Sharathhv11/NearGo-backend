import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";
import CustomError from "../../utils/customError.js";
import Relationship from "../../models/relationshipSchema.js";



const getAcceptedRelationships = handelAsyncFunction(
  async (req, res, next) => {
    const { userId } = req.params;

    const relations = await Relationship.find({
      $or: [{ requester: userId }, { receiver: userId }],
      status: "accepted",
    }).populate("requester receiver", "username email");

    res.status(200).json({
      status: "success",
      results: relations.length,
      data: relations,
    });
  }
);

export default getAcceptedRelationships;
