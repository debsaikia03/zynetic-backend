import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true, min: 0, max: 5
    },
    publishedDate: {
        type: Date,
        required: true
    },
}, {timestamps: true}
);

export default mongoose.model("Book", bookSchema);