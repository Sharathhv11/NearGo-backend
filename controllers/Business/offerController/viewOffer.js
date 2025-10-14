import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import offerModel from "../../../models/BusinessModels/offers.js";
import businessModel from "../../../models/BusinessModels/business.js";
import CustomError from "../../../utils/customError.js";


const viewOffer = handelAsyncFunction(async function(req,res,next){

    const {businessId} = req.params;

    const business = await businessModel.findById(businessId);

    if( !business ){
        return next(new CustomError(404,`No business exists with id ${businessId}.`));
    }

    const {u} = req.query;
    
    const currentDate = new Date();

    let dbQuery = {}; 
    
    if( u === "upcoming" ){
        dbQuery = {
            startingDate:{
                $gt : currentDate 
            }
        }
    }else if( u === "ongoing" ){
        dbQuery = {
            startingDate:{
                $lte : currentDate 
            }
        }
    }

    const limit = req.query.limit || 10;
    const page = req.query.page || 1;

    const resData = await offerModel.find({
        offeringBy:businessId,
        ...dbQuery
    }).limit(limit).skip(limit * (page - 1));


    res.status(200).send({
        status :"success",
        message : "successfully fetched offers.",
        data : resData
    });

});

export default viewOffer;