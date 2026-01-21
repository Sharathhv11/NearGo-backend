
import followingModel from "../../../models/followModels/following.js";
import handelAsyncFunction from "./../../../utils/asyncFunctionHandler.js";


const followingStatus = handelAsyncFunction(async function(req,res,next){
    const {businessID} = req.params;
    const userId = req.user._id;


    const doesFollow = await followingModel.findOne({
        user:userId,
        following : businessID
    });

    res.status(200).send({
        status:"success",
        message:"Successfully fetch following status.",
        data : {
            "followingStatus" : Boolean(doesFollow)
        }
    });

});


export default followingStatus