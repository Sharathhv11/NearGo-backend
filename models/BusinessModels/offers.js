import mongoose from "mongoose";

const { Schema } = mongoose;

const offerSchema = new Schema({
  offeringBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: [true, "offeringBy is required feild."],
  },
  offerName: {
    type: String,
    required: [true, "name of the offer is required"],
    minlength: 1,
    maxlength: 50,
  },
   description: {
    type: String,
    maxlength: 200,
    trim: true
  },
   discount: {
    type: {
      type: String,
      enum: ["percentage", "flat"],
    },
    value: {
      type: Number,
      min: 1
    }
  },
  startingDate: {
    type: Date,
    required: [true,"Starting date is required"],
  },
  endingDate: {
    type: Date,
    required: [true,"Ending date is requied"],
    validate: {
      validator: function () {
        return this.endingDate > this.startingDate;
      },
      message: "Ending date must be after starting date",
    },
  },
},{
    timestamps:true
});

const offerModel = mongoose.model("Offers", offerSchema);
export default offerModel;
