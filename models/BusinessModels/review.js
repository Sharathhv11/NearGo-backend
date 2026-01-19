import mongoose from "mongoose";

const { Schema } = mongoose;

// review schema
const reviewSchema = new Schema(
  {
    BusinessID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: [true, "business id is required for registering review."],
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user id is required for registering review."],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "rating must be provided between 1 to 5."],
    },

    comment: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 500,
    },

    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    dislike: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    likedByOwner: {
      type: Boolean,
      default: false,
    },

    edited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel;
