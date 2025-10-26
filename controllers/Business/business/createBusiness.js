import businessModel from "./../../../models/BusinessModels/business.js"
import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";

const createBusiness = handelAsyncFunction( async (req,res,next)=>{
    //^ inserting the business information into database 

    const businessInformatin = req.body;

    const owner = req.user;
    
    const businessDocu = await businessModel.create({
        ...businessInformatin,
        owner
    }) ;

    businessDocu.owner = businessDocu.owner._id;
    res.status(201).send({
        status:"success",
        message:"Business registered Successfully.",
        data : businessDocu
    });

    
});


export default createBusiness;