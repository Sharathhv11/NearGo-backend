import mongoose, { Schema, model } from "mongoose";

const followersSchema = new Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Whether user's followers list is visible to others
    visibility: {
      type: Boolean,
      default: false, // false → private, true → public
    },
  },
  { timestamps: true }
);

export default model("Followers", followersSchema);
