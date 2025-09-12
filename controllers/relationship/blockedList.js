import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";
import CustomError from "../../utils/customError.js";
import Relationship from "../../models/relationShipSchema.js";


const getBlockedRelationships = handelAsyncFunction(
  async (req, res, next) => {
    const { userId } = req.params;

    const relations = await Relationship.find({
      requester: userId,
      status: "blocked",
    }).populate("receiver", "username email");

    res.status(200).json({
      status: "success",
      results: relations.length,
      data: relations,
    });
  }
);


export default getBlockedRelationships;