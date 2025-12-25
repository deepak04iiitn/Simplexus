import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true,
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reportType: {
        type: String,
        enum: ['Campaign', 'Deliverable', 'Creator', 'Agency'],
        default: 'Campaign',
    },
    format: {
        type: String,
        enum: ['PDF', 'CSV', 'Web'],
        default: 'PDF',
    },
    shareableLink: {
        type: String,
        unique: true,
        sparse: true,
    },
    sharedWith: [{
        email: String,
        sharedAt: Date,
    }],
    data: {
        type: mongoose.Schema.Types.Mixed, // Store report data as JSON
    },
    generatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
export default Report;

