import mongoose from "mongoose";

const { Schema } = mongoose;

// Review Schema
const reviewSchema = new Schema(
  {
    BusinessID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business", // The service being reviewed
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Who wrote the review
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
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
    replies: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, trim: true, maxlength: 300 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    edited:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

const reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel;
