import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },

    username: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 50,
      default: undefined,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => /\S+@\S+\.\S+/.test(v),
        message: "Please provide a valid email address",
      },
    },

    password: {
      type: String,
      minlength: 8,
      maxlength: 100,
      default: null,
      select: false,
    },

    interest: {
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
    },

    phone_no: {
      type: String,
      trim: true,
      minlength: 10,
      maxlength: 15,
      validate: {
        validator: (v) => /^\d+$/.test(v),
        message: "Phone number should contain only digits",
      },
    },

    verified: {
      type: Boolean,
      default: false,
    },

    token: {
      type: String,
      default: null,
    },

    tokenExpires: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    role: {
      type: String,
      enum: ["customer", "admin", "provider"],
      default: "customer",
    },

    profilePicture: {
      type: String,
      default: null,
    },
    profileImageSource: {
      type: String,
      enum: ["google", "cloud"],
      default: "cloud",
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      required: true,
      default: "local",
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    account: {
      type: {
        type: String,
        enum: ["free", "premium"],
        default: "free",
      },
      expiresAt: {
        type: Date,
        default: null,
      },
      paymentInfo: {
        razorpay_order_id: {
          type: String,
          default: null,
        },
        razorpay_payment_id: {
          type: String,
          default: null,
        },
        razorpay_signature: {
          type: String,
          default: null,
        },
      },
    },

    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notifications",
      },
    ],
  },
  { timestamps: true },
);

/**
 * Hash password before save
 */
userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();

  this.password = await bcrypt.hash(
    this.password,
    Number(process.env.SALTROUNDS),
  );

  this.passwordChangedAt = Date.now();
  next();
});

/**
 * Compare password
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
