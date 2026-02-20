import mongoose from "mongoose";
const { Schema } = mongoose;

const analyticsSchema = new Schema(
  {
    businessID: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      unique: true,
      index: true,
    },

    /* ================= FOLLOWERS ================= */

    followers: {
      totalFollowers: { type: Number, default: 0 },

      history: [
        {
          date: String, // "2026-02-20"
          countChange: Number, // +1 / -1
        },
      ],
    },

    /* ================= PROFILE VIEWS ================= */

    profileViews: {
      totalViews: { type: Number, default: 0 },

      viewsByDate: [
        {
          date: String,
          count: { type: Number, default: 0 },
        },
      ],
    },

    /* ================= POST ANALYTICS ================= */

    posts: [
      {
        postId: {
          type: Schema.Types.ObjectId,
          ref: "Tweet",
        },

        totalViews: { type: Number, default: 0 },

        viewsByDate: [
          {
            date: String,
            count: { type: Number, default: 0 },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const Analytics = mongoose.model("Analytics", analyticsSchema);