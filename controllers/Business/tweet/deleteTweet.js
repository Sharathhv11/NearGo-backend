import businessModel from "../../../models/BusinessModels/business.js";
import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import tweetModel from "../../../models/tweet/tweetModel.js";
import CustomError from "../../../utils/customError.js";
import cleanUpCloud from "../../../utils/cleanUpCloud.js";

const deleteTweet = handelAsyncFunction(async function(req,res,next){
        const {businessId,tweetId} = req.params;

        const business = await businessModel.findById(businessId);

        if( !business ){
            return next(new CustomError(404,`There is no business with business ID ${businessId}.`));
        }

        if( business.owner.toString() !== req.user._id.toString() ){
            return next(new CustomError(403,"only owner of the tweet is able to delete the tweet."));
        }

        const deletedTweet = await tweetModel.findByIdAndDelete(tweetId);

        if( !deletedTweet ){
            return next(new CustomError(404,`No tweet exists with id  ${tweetId}.`));
        }

        await cleanUpCloud(deletedTweet.media.map(e=>e.url));

        res.status(200).send({
            status:"success",
            message :"tweet deleted successfully."
        });

        
}); 


export default deleteTweet;