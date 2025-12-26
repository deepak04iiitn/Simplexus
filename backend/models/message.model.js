import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
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
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    isInternal: {
        type: Boolean,
        default: false, // false = visible to creator, true = internal team only
    },
    taggedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    readBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        readAt: {
            type: Date,
            default: Date.now,
        },
    }],
}, { timestamps: true });

// Index for faster queries
messageSchema.index({ campaignId: 1, creatorId: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;

