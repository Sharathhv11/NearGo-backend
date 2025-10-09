import mongoose from "mongoose";

const { Schema } = mongoose;

const locationSchema = new  Schema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String },
  city: { type: String, required: true },
  area: { type: String },
  pincode: { type: String, required: true },

  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      default:"Point",
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true,"co-ordinates are required."],
      validate:{
        validator:function(v){
           const [lng, lat] = v;
          if (lng < -180 || lng > 180) return false; // longitude check
          if (lat < -90 || lat > 90) return false;   // latitude check
        },
        message:"Invalid coordinates: longitude must be -180 to 180, latitude must be -90 to 90"
      }
    },
  },
});

// Geo index
locationSchema.index({ coordinates: "2dsphere" });

const phoneSchema = new Schema({
  phone: {
    countryCode: {
      type: String,
      required: [true,"Country code is required ex:india +91."], // e.g. "+91"
    },
    number: {
      type: String,
      required: true, // e.g. "9876543210"
      validate: {
        validator: function (v) {
          return /^[0-9]{6,15}$/.test(v); // generic validation
        },
        message: "Invalid phone number format",
      },
    },
  },
});

const businessSchema = new Schema({
  businessName: {
    type: String,
    required: [true, "Business Name is required"],
    trim: true,
    minlength: 1,
    maxlength: 100,
  },
  owner: {
      type : mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
  },

  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: 10,
    maxlength: 500,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: "Please provide a valid email address.",
    },
  },

  location : {
    type:locationSchema,
    required : [true,"location of the business is required."]
  },
  phoneNo :{
    type : [phoneSchema] ,
    validate : v=>v.length > 0,
    required : [true,"Atleast need to provide one business number."]
  },

  offers: {
    type: [String],
  },
  status : {
    type: String,
    enum : ["Open","Closed"],
    default:"Closed"
  },
  categories: { type: [String], required: true },
  workingHours: {
    weekdays: { open: String, close: String },
    weekends: { open: String, close: String }
  },
  media: {
    logo: String,
    images: [String],
    videos: [String],
  },
  verification: {
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: Date
  },
  socialLinks: {
    website: String,
    facebook: String,
    instagram: String,
    twitter: String,
  },
  rating:{
      sumOfReview : {
        type : Number,
        default : 0
      },
      totalReview : {
        type : Number,
        default : 0
      }
  }
});


const businessModel = mongoose.model("Business",businessSchema);

export default businessModel;