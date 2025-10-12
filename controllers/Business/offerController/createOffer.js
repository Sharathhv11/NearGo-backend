import offerModel from "../../../models/BusinessModels/offers.js";
import asyncHandler from "./../../../utils/asyncFunctionHandler.js";
import businessModel from "../../../models/BusinessModels/business.js";
import CustomError from "../../../utils/customError.js";


const createOffer = asyncHandler( async function(req,res,next){
    const { businessId } = req.params;

    const isBusinessExists = await businessModel.findById(businessId);

    if( !isBusinessExists ){
        return next(new CustomError(404,`no business exists with id ${businessId}`));
    }

    if( Object.keys(req.body).length == 0  ){
        return next( new CustomError(400,"No data provided for posting offer."));
    }

    const filteredBody = {};
    const validFields = ["offeringBy","offerName","description","discount","startingDate","endingDate"];
    
    for( let key in req.body ){
        if( validFields.includes(key) ){
            filteredBody[key] = req.body[key];
        }
    }

    if( Object.keys(filteredBody).length == 0 ){
        return next(new CustomError(400,"No valid fields provided for posting offer."));
    }

    filteredBody.offeringBy = businessId;

    const offer = await offerModel.create(filteredBody);

    res.status(201).send({
        status : "success",
        message : `offer posted success fully and will go live on ${filteredBody.startingDate} and ends on ${filteredBody.endingDate}`,
        data : offer
    });
    
});


export default createOffer;