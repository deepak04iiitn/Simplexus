import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    platforms: [{
        type: String,
        enum: ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn', 'Facebook', 'Other'],
    }],
    numberOfCreators: {
        type: Number,
        required: true,
    },
    timeline: {
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    status: {
        type: String,
        enum: ['Draft', 'Active', 'In Review', 'Completed', 'Cancelled'],
        default: 'Draft',
    },
    briefId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brief',
        default: null,
    },
    assignedCreators: [{
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        acknowledgedAt: {
            type: Date,
            default: null,
        },
        acknowledgmentStatus: {
            type: String,
            enum: ['Pending', 'Acknowledged', 'Declined'],
            default: 'Pending',
        },
    }],
    teamMembers: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        role: {
            type: String,
            enum: ['Owner', 'Admin', 'Member', 'Viewer'],
            default: 'Member',
        },
        addedAt: {
            type: Date,
            default: Date.now,
        },
    }],
}, { timestamps: true });

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;

