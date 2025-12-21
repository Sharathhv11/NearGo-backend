import mongoose from "mongoose";
import bcrypt from "bcrypt";

//? User schema of the application
const userScheme = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },

    username: {
      type: String,
      unique: true,
      minlength: 1,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
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

    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
      maxlength: 100,
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
      message: props => `"${props.value}" is not supported. Please choose one of the given interests.`
    },

    phone_no: {
      type: String,
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 15,
      validate: {
        validator: function (v) {
          return /^\d+$/.test(v);
        },
        message: "Phone number should contain only digits.",
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
      required: [true, "Role is required"],
      enum: ["customer", "admin", "provider"],
      default: "customer",
    },

    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notifications",
      },
    ],
  },
  { timestamps: true }
);

userScheme.index(
  { username: 1 },
  {
    unique: true,
    partialFilterExpression: {
      username: { $exists: true, $ne: null }
    }
  }
);


// 🔒 Hash password before saving
userScheme.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, +process.env.SALTROUNDS);
  this.passwordChangedAt = Date.now();
  next();
});

// 🔑 Compare password method
userScheme.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

const userModel = mongoose.model("User", userScheme);

export default userModel;
