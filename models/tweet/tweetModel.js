import mongoose, { Schema, model } from "mongoose";

const tweetSchema = new Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: [true, "Business id should be provided."],
    },

    tweet: {
      type: String,
      required: [true, "Tweet is the required field."],
      trim: true,
      minlength: 1,
      maxlength: 2000,
    },

    media: [
      {
        url: {
          type: String,
          trim: true,
        },
        type: {
          type: String,
          enum: ["image", "video"],
        },
      },
    ],

    hashtags: [String],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    views: {
      type: Number,
      default: 0,
    },

    replies: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, trim: true,minlength: 1, maxlength: 300 },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    visibility: {
      type: String,
      enum: ["public", "followers"],
      default: "public",
    },
    edited : {
      type:Boolean,
      default : false
    }
  },
  { timestamps: true }
);

tweetSchema.index({ hashtags: 1 });

const tweetModel = model("Tweet", tweetSchema);

export default tweetModel;
