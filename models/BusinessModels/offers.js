import mongoose from "mongoose";

const { Schema } = mongoose;

const offerSchema = new Schema(
  {
    offeringBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: [true, "offeringBy is required field."],
    },

    offerName: {
      type: String,
      required: [true, "name of the offer is required"],
      minlength: 1,
      maxlength: 100,
    },

    description: {
      type: String,
      required: [true, "offer description is required"],
      maxlength: 200,
      trim: true,
    },

    discount: {
      type: {
        type: String,
        enum: ["percentage", "flat"],
      },
      value: {
        type: Number,
        min: 1,
      },
    },

    image: {
      type: String,
      trim: true,
      default: null,
    },

    startingDate: {
      type: Date,
      required: [true, "Starting date is required"],
    },

    endingDate: {
      type: Date,
      required: [true, "Ending date is required"]
    },
  },
  {
    timestamps: true,
  }
);

const offerModel = mongoose.model("Offers", offerSchema);
export default offerModel;
