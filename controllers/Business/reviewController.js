import businessModel from "../../models/BusinessModels/business.js";
import reviewModel from "./../../models/BusinessModels/review.js";
import asyncHandler from "./../../utils/asyncFunctionHandler.js";
import CustomeError from "./../../utils/customError.js";

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
      new CustomeError(
        400,
        `No business registered with id ${filteredBody.BusinessID}.`
      )
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
    { new: true, select: "rating" }
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

  if (matchUser.userId._id !== req.user) {
    return next(
      new CustomeError(400, "Only owner of the review can delete it.")
    );
  }

  if (!matchUser) {
    return next(new CustomeError(400, `No review exists with ${reviewId}`));
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
    { new: true, select: "rating" }
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

  function queryUpdate(body) {
    const modifiedBody = { ...body };

    for (let field in body) {
      if (field === "like") {
        delete modifiedBody.like;
        modifiedBody.$push = {
          ...modifiedBody.$push,
          like: req.user._id || body.like,
        };
      }
      if (field === "dislike") {
        delete modifiedBody.dislike;
        modifiedBody.$push = {
          ...modifiedBody.$push,
          dislike: req.user._id || body.dislike,
        };
      }
      if (field === "replies") {
        delete modifiedBody.replies;
        modifiedBody.$push = {
          ...modifiedBody.$push,
          replies: {
            ...body.replies,
            user: req.user._id || body.replies.user,
          },
        };
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
        new CustomeError(404, `No business found with id ${businessId}`)
      );
    }
  }

  const oldReview = await reviewModel.findById(reviewId);
  if (!oldReview) {
    return next(new CustomeError(404, `No review found with id ${reviewId}`));
  }

  const updatedReview = await reviewModel.findByIdAndUpdate(
    reviewId,
    updatingFields,
    {
      new: true,
      runValidators: true,
    }
  );

  

  let updatedRating;
  if (updatingFields.rating) {
    updatedRating = await businessModel.findByIdAndUpdate(
      businessId,
      {
        $inc: {
          "rating.sumOfReview":
            -oldReview.rating + updatingFields.rating
        },
      },
      { new: true, select: "rating" }
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

const getReviews = asyncHandler(async (req, res, next) => {
    const { businessId } = req.params;

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    

    const reviews = await reviewModel.find({
      BusinessID : businessId
    }).limit(limit).skip(limit*page).populate("userId","email username verified profilePicture");


    res.status(200).send({
      status : "success",
      message : "Reviews fetched successfully",
      data : reviews
    })

});

export { createReview, deleteReview, updateReview, getReviews };
