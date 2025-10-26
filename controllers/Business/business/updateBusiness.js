import businessModel from "../../../models/BusinessModels/business.js";
import handleAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import CustomError from "../../../utils/customError.js";

const updateBusiness = handleAsyncFunction(async (req, res, next) => {
    //^ This controller allows the user to update allowed fields of a business
    const { businessID } = req.params;
    const updates = req.body;

    const updatableFields = [
        "businessName",
        "description",
        "email",
        "location",
        "phoneNo",
        "status",
        "categories",
        "media",
        "socialLinks"
    ];

    if (!Object.keys(updates).length) {
        return next(new CustomError(400, "No data has been sent to update business."));
    }

    // Filter only allowed fields
    const filteredUpdate = {};
    Object.keys(updates).forEach(key => {
        if (updatableFields.includes(key)) {
            filteredUpdate[key] = updates[key];
        }
    });

    if (!Object.keys(filteredUpdate).length) {
        return next(new CustomError(400, "No valid fields provided for update."));
    }

    const updatedResult = await businessModel.findByIdAndUpdate(
        businessID,
        filteredUpdate,
        { new: true, runValidators: true }
    );

    if (!updatedResult) {
        return next(new CustomError(404, "Business not found."));
    }

    res.status(200).send({
        status: "success",
        data: updatedResult
    });
});

export default updateBusiness;
