import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import offerModel from "../../../models/BusinessModels/offers.js";
import businessModel from "../../../models/BusinessModels/business.js";
import CustomError from "../../../utils/customError.js";


const deleteOffer = handelAsyncFunction( async function(req,res,next){
    const {businessId,offerId} = req.params;

    const business = await businessModel.findById(businessId);

    if( !business ){
        return next(new CustomError(404,"No business exists with given businessID."));
    }


    const deletedOffer = await offerModel.findByIdAndDelete(offerId);

    if( !deletedOffer ) {
        return next(new CustomError(404,"No offer exists with the given offerID."))
    }

    res.status(200).send({
        status :"success",
        message : "successfully deleted the offer."
    });
});


export default deleteOffer;