import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true,
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: String,
    category: {
        type: String,
        enum: ['Brand to Creator', 'Creator to Brand', 'Agency to Creator', 'Creator to Agency'],
    },
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;

