import mongoose from "mongoose";

const deliverableSchema = new mongoose.Schema({
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true,
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    platform: {
        type: String,
        enum: ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn', 'Facebook', 'Other'],
        required: true,
    },
    contentType: {
        type: String,
        enum: ['Reel', 'Post', 'Story', 'Video', 'Tutorial', 'Review', 'Unboxing', 'Other'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Draft Submitted', 'In Review', 'Revision Requested', 'Approved', 'Posted', 'Completed'],
        default: 'Pending',
    },
    drafts: [{
        version: {
            type: Number,
            required: true,
        },
        videoLink: String,
        thumbnailLink: String,
        driveLink: String,
        dropboxLink: String,
        notes: String,
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['Submitted', 'Approved', 'Revision Requested', 'Rejected'],
            default: 'Submitted',
        },
    }],
    currentVersion: {
        type: Number,
        default: 0,
    },
    approvedVersion: {
        type: Number,
        default: null,
    },
    postingDetails: {
        postUrl: String,
        screenshotUrl: String,
        postTimestamp: Date,
        caption: String,
        hashtags: [String],
        verified: {
            type: Boolean,
            default: false,
        },
        verifiedAt: Date,
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    performance: {
        views: Number,
        likes: Number,
        shares: Number,
        saves: Number,
        comments: Number,
        engagementRate: Number,
        updatedAt: Date,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    revisionDueDate: Date,
}, { timestamps: true });

const Deliverable = mongoose.model('Deliverable', deliverableSchema);
export default Deliverable;

