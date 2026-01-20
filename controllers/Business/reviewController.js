import businessModel from "../../models/BusinessModels/business.js";
import reviewModel from "./../../models/BusinessModels/review.js";
import handelAsyncFunction from "./../../utils/asyncFunctionHandler.js";
import asyncHandler from "./../../utils/asyncFunctionHandler.js";
import CustomError from "./../../utils/customError.js";

const createReview = asyncHandler(async (req, res, next) => {
  const inValidFields = ["like", "dislike", "replies", "edited"];
  const filteredBody = {};

  for (let field in req.body) {
    if (!inValidFields.includes(field)) {
      filteredBody[field] = req.body[field];
    }
  }

  filteredBody.userID = req.user._id;

  const { businessId } = req.params;

  filteredBody.BusinessID = businessId;

  const businessDocu = await businessModel.findById(filteredBody.BusinessID);

  if (!businessDocu) {
    return next(
      new CustomError(
        400,
        `No business registered with id ${filteredBody.BusinessID}.`,
      ),
    );
  }

  //^ verify weather owner posting the review
  if (businessDocu.owner.toString() === req.user._id.toString()) {
    return next(
      new CustomError(400, "Owner is not permitted to post reviews."),
    );
  }

  filteredBody.userId = req.user;

  let document = await reviewModel.create(filteredBody);
  document = await document.populate("userId", "email username profilePicture");

  const updatedBusiness = await businessModel.findByIdAndUpdate(
    filteredBody.BusinessID,
    {
      $inc: {
        "rating.sumOfReview": filteredBody.rating,
        "rating.totalReview": 1,
      },
    },
    { new: true, select: "rating" },
  );

  res.status(201).send({
    status: "success",
    message: "Review posted successfully.",
    data: {
      review: document,
      rating: updatedBusiness,
    },
  });
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const { reviewId, businessId } = req.params;

  const matchUser = await reviewModel.findById(reviewId);

  if (matchUser.userId.toString() !== req.user._id.toString()) {
    return next(
      new CustomError(400, "Only owner of the review can delete it."),
    );
  }

  if (!matchUser) {
    return next(new CustomError(400, `No review exists with ${reviewId}`));
  }

  const deletedReview = await reviewModel.findByIdAndDelete(reviewId);

  const updatedBusiness = await businessModel.findByIdAndUpdate(
    deletedReview.BusinessID,
    {
      $inc: {
        "rating.sumOfReview": -deletedReview.rating,
        "rating.totalReview": -1,
      },
    },
    { new: true, select: "rating" },
  );

  res.status(201).send({
    status: "success",
    message: "Review deleted successfully.",
    data: updatedBusiness,
  });
});

const updateReview = asyncHandler(async (req, res, next) => {
  const inValidFields = ["edited", "BusinessID", "userId"];
  const filteredBody = {};

  for (let field in req.body) {
    if (!inValidFields.includes(field)) {
      filteredBody[field] = req.body[field];
    }
  }

  const { reviewId, businessId } = req.params;

  const oldReview = await reviewModel.findById(reviewId).populate("BusinessID","owner");
  if (!oldReview) {
    return next(new CustomError(404, `No review found with id ${reviewId}`));
  }

  function queryUpdate(body) {
    const modifiedBody = {};

    /* like toggle */
    if (body.like) {
      const hasLiked = oldReview.like.includes(req.user._id);
      const hasDisliked = oldReview.dislike.includes(req.user._id);

      modifiedBody.$pull = {};
      modifiedBody.$addToSet = {};

      if (hasLiked) {
        modifiedBody.$pull.like = req.user._id;
      } else {
        modifiedBody.$addToSet.like = req.user._id;
      }

      if (hasDisliked) {
        modifiedBody.$pull.dislike = req.user._id;
      }
    }

    /* dislike toggle */
    if (body.dislike) {
      const hasDisliked = oldReview.dislike.includes(req.user._id);
      const hasLiked = oldReview.like.includes(req.user._id);

      modifiedBody.$pull = {};
      modifiedBody.$addToSet = {};

      if (hasDisliked) {
        modifiedBody.$pull.dislike = req.user._id;
      } else {
        modifiedBody.$addToSet.dislike = req.user._id;
      }

      if (hasLiked) {
        modifiedBody.$pull.like = req.user._id;
      }
    }

    if (typeof body.likedByOwner === "boolean") {
      if (oldReview.BusinessID.owner.toString() !== req.user._id.toString()) {
        return next(
          new CustomError(400, "Only owner can provide the owner like."),
        );
      }
      modifiedBody.likedByOwner = !oldReview.likedByOwner;
    }

    /* normal field updates */
    for (let field in body) {
      if (field !== "like" && field !== "dislike" && field !=="likedByOwner") {
        modifiedBody[field] = body[field];
      }
    }

    return modifiedBody;
  }

  const updatingFields = queryUpdate(filteredBody);

  let business;
  if (updatingFields.rating) {
    business = await businessModel.findById(businessId);
    if (!business) {
      return next(
        new CustomError(404, `No business found with id ${businessId}`),
      );
    }
  }

  const updatedReview = await reviewModel.findByIdAndUpdate(
    reviewId,
    updatingFields,
    {
      new: true,
      runValidators: true,
    },
  );

  let updatedRating;
  if (updatingFields?.rating) {
    updatedRating = await businessModel.findByIdAndUpdate(
      businessId,
      {
        $inc: {
          "rating.sumOfReview": -oldReview.rating + updatingFields.rating,
        },
      },
      { new: true, select: "rating" },
    );
  }

  res.status(200).send({
    status: "success",
    message: "Review updated successfully.",
    data: {
      review: updatedReview,
      ...(updatedRating ? { rating: updatedRating } : {}),
    },
  });
});

const getReviews = asyncHandler(async (req, res) => {
  const { businessId } = req.params;

  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const skip = (page - 1) * limit;

  const [reviews, totalReviews] = await Promise.all([
    reviewModel
      .find({ BusinessID: businessId })
      .populate("userId", "email username verified profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    reviewModel.countDocuments({ BusinessID: businessId }),
  ]);

  res.status(200).json({
    status: "success",
    message: "Reviews fetched successfully",
    reviews,
    totalReviews,
    totalPages: Math.ceil(totalReviews / limit),
    currentPage: page,
  });
});

export { createReview, deleteReview, updateReview, getReviews };
