import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    deliverableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deliverable',
        required: true,
    },
    draftVersion: {
        type: Number,
        required: true,
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comments: [{
        type: {
            type: String,
            enum: ['General', 'Timestamp', 'Brief Check', 'Legal'],
            default: 'General',
        },
        content: String,
        timestamp: String, // For video timestamp comments (e.g., "0:14")
        briefItemId: String, // Reference to brief item if applicable
        taggedUsers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        isInternal: {
            type: Boolean,
            default: false, // false = visible to creator, true = internal only
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    briefItemsStatus: [{
        itemId: String,
        itemText: String,
        status: {
            type: String,
            enum: ['Completed', 'Missing', 'Needs Improvement'],
        },
    }],
    decision: {
        type: String,
        enum: ['Approve', 'Request Revision', 'Reject'],
        default: null,
    },
    revisionNotes: String,
    decisionAt: Date,
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;

