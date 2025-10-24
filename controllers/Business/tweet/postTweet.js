import businessModel from "../../../models/BusinessModels/business.js";
import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import tweetModel from "../../../models/tweet/tweetModel.js";
import CustomError from "../../../utils/customError.js";


const postTweet = handelAsyncFunction(async function(req,res,next){
    const { businessId } = req.params;

    if( !businessId ){
        return next(new CustomError(400,`Provide valid businessID.`) );
    }

    const business = await businessModel.findById(businessId);

    if( !business ){
        return next(new CustomError(404,`No business exists with ${businessId}.`) );
    }

    const {tweet} = req.body;
    if (!tweet || tweet.trim().length === 0) {
        return next(new CustomError(400, "Tweet content is required."));
    }

    const validFields = ["tweet","hashtags","visibility"];
    for( let key in req.body ){
        if( !validFields.includes(key) ) delete req.body[key];
    }

    req.body.postedBy = businessId;

    const tweetDocument = await tweetModel.create(req.body);

    res.status(201).send({
        status : "success",
        message : "tweet posted successfully.",
        data : tweetDocument
    })


});

export default postTweet;