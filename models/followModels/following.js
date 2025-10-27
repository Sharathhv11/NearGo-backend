import mongoose, { Schema, model } from "mongoose";

const followingSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
      },
    ],

    visibility: {
      type: Boolean,
      default: false, // false → private, true → public
    },
  },
  { timestamps: true }
);

export default model("Following", followingSchema);
