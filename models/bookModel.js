import mongoose from "mongoose";


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide the title of the book."],
        minlength: [1, "Title must have at least 1 character."],
        maxlength: [150, "Title must not exceed 150 characters."],
        trim: true
    },
    author: {
        type: String,
        required: [true, "Please provide the author of the book."],
        trim: true,
        minlength: [1, "Author must have at least 1 character."],
        maxlength: [150, "Author must not exceed 150 characters."]
    },
    genre: {
        type: [String],
        required: [true, "Please provide at least one genre for the book."]
    },
    publishedYear: {
        type: Number,
        required: [true, "Please provide the published year of the book."],
        min: [1000, "Books published before the year 1000 are not supported on our platform."],
        max: [new Date().getFullYear() + 4, "The published year cannot be more than 4 years in the future."]
    },
    basePrice: {
        type: Number,
        min: [1, "Base price must be at least ₹1."]
    },
    sellingPrice: {
        type: Number,
        required: [true, "Need to set a price for selling."],
        min: [1, "Selling price must be at least ₹1."]
    },
    description: {
        type: String,
        required: [true, "Description of the book is required."],
        trim: true
    },
    coverImage: {
        type: [String], 
        required: [true, "At least one cover image is required."],
        validate: {
            validator: function (value) {
                return value.length >= 1; 
            },
            message: "You must upload at least one cover image."
        }
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    associatedWith: {
        type: [String],
        required: [true, "Please specify at least one association (e.g., college, city, etc.)."],
        validate: {
            validator: function (value) {
                return value.length > 0 && value.every(item => item.trim().length > 0);
            },
            message: "Each association must be a non-empty string."
        }
    }
}, {
    timestamps: true 
});






const bookModel = mongoose.model("Books",bookSchema);

export default  bookModel;