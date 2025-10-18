import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import offerModel from "../../../models/BusinessModels/offers.js";
import businessModel from "../../../models/BusinessModels/business.js";
import CustomError from "../../../utils/customError.js";


const updateOffer = handelAsyncFunction(async function(req,res,next){
    const {businessId,offerId} = req.params;

    const business = await businessModel.findById(businessId);

    if( !business ){
        return next(new CustomError(404,`no business exists with given business id.`))
    }

    const validFields = ["offerName","description","discount","startingDate","endingDate"];
    
    for( let key in req.body ){
        if( !validFields.includes(key) )
            delete req.body[key];
    }

    const updatedOffer = await offerModel.findByIdAndUpdate(offerId,req.body,{
        runValidators:true,
        new:true
    });

    if( !updatedOffer ){
        return next(new CustomError(404,"given offer is not exists to edit."))
    }

    res.status(201).send({
        status :"success",
        message:"updated offer successfully.",
        data : updatedOffer
    });
});


export default updateOffer;