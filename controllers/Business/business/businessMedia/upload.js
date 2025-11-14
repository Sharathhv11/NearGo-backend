import handleAsyncFunc from "./../../../../utils/asyncFunctionHandler.js";
import businessModel from "../../../../models/BusinessModels/business.js";
import CustomError from "../../../../utils/customError.js";
import uploadToCloud from "./../../../../utils/uploadFiles.js";

const uploadMedia = handleAsyncFunc(async function (req, res, next) {
  const { businessId } = req.params;

  const business = await businessModel.findById(businessId);
  if (!business) {
    return next(
      new CustomError(404, `No business exists with the id ${businessId}.`)
    );
  }

  if (business.owner.toString() !== req.user._id.toString()) {
    return next(
      new CustomError(403, "Only the business owner is permitted to upload media.")
    );
  }

  if (!req.files || req.files.length === 0) {
    return next(new CustomError(400, "No media file was sent for upload."));
  }

  const used = business.media.length;
  const limit = Number(process.env.MEDIALIMIT) || 5;

  if (used >= limit) {
    return next(
      new CustomError(
        400,
        `You have already reached the max upload limit of ${limit} files.`
      )
    );
  }

  const remaining = limit - used;
  const filesToUpload = req.files.slice(0, remaining);

  const urls = (await uploadToCloud(filesToUpload)).map((f) => f.url.trim());

  const updatedBusiness = await businessModel.findByIdAndUpdate(
    businessId,
    { $push: { media: { $each: urls } } },
    { new: true }
  );

  res.status(201).send({
    status: "success",
    message: "Media uploaded successfully.",
    data: updatedBusiness,
  });
});

export default uploadMedia;
