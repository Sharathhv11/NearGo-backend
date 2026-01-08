import mongoose from "mongoose";

const { Schema } = mongoose;


//! location schema
const locationSchema = new Schema({
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
    default: "Point",
  },
  coordinates: {
    type: [Number],
    default: null,   //!allow empty initially
    validate: {
      validator: function (v) {
        if (!v) return true; //!allow empty
        const [lng, lat] = v;
        if (lng < -180 || lng > 180) return false;
        if (lat < -90 || lat > 90) return false;
        return true;
      },
      message: "Invalid coordinates",
    },
  },
},

  
  },
);

// Geo index
locationSchema.index({ coordinates: "2dsphere" });

//! phone number schema 

const phoneSchema = new Schema({
  phone: {
    countryCode: {
      type: String,
      required: [true, "Country code is required (ex: +91)"],
    },
    number: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^[0-9]{6,15}$/.test(v),
        message: "Invalid phone number format",
      },
    },
  },
});

//! main business schema 

const businessSchema = new Schema(
  {
    businessName: {
      type: String,
      required: [true, "Business Name is required"],
      trim: true,
      minlength: 1,
      maxlength: 100,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Business DP
    profile: {
      type: String,
      default: null,
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
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => /\S+@\S+\.\S+/.test(v),
        message: "Please provide a valid email address",
      },
    },

    location: {
      type: locationSchema,
      required: [true, "Business location is required"],
    },

    phoneNo: {
      type: [phoneSchema],
      required: [true, "At least one business phone number is required"],
      validate: (v) => v.length > 0,
    },

    categories: {
      type: [String],
      enum: [
        "Clothing Store",
        "Electronics",
        "Mobile Store",
        "Furniture",
        "Jewellery",
        "Home Appliances",
        "Supermarket",
        "Grocery Store",
        "Footwear",
        "Cosmetics",
        "Restaurant",
        "Cafe",
        "Bakery",
        "Fast Food",
        "Catering Service",
        "Hotel",
        "Resort",
        "Salon",
        "Spa",
        "Car Repair",
        "Bike Repair",
        "Plumber",
        "Electrician",
        "House Cleaning",
        "Pest Control",
        "Laundry Service",
        "Internet Service",
        "Printing Service",
        "School",
        "College",
        "Coaching Centre",
        "Tuition Centre",
        "Training Institute",
        "Computer Institute",
        "Hospital",
        "Clinic",
        "Pharmacy",
        "Diagnostic Lab",
        "Fitness Centre",
        "Yoga Studio",
        "Cricket Club",
        "Gaming Zone",
        "Playground",
        "Cinema",
        "Mall",
        "Real Estate",
        "Finance",
        "Insurance",
        "Consulting",
        "IT Services",
        "Marketing Agency",
        "Event Management",
        "Photography Service",
      ],
      default: [],
    },

    workingHours: {
      weekdays: { open: String, close: String },
      weekends: { open: String, close: String },
    },

    media: {
      type: [String],
      default: [],
    },

    offers: {
      type: [String],
      default: [],
    },

    socialLinks: {
      website: String,
      facebook: String,
      instagram: String,
      twitter: String,
    },

    verification: {
      isVerified: { type: Boolean, default: false },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      verifiedAt: Date,
    },

    rating: {
      sumOfReview: { type: Number, default: 0 },
      totalReview: { type: Number, default: 0 },
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Closed",
    },

    profileCompletion: {
      type: Number,
      default: 20,
      min: 0,
      max: 100,
    },

    profileStage: {
      type: String,
      enum: ["basic", "details", "media", "verification", "complete"],
      default: "basic",
    },
  },
  { timestamps: true }
);

const businessModel = mongoose.model("Business", businessSchema);

export default businessModel;
