import mongoose from "mongoose";
import crypto from 'crypto';

const invitationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true,
    },
    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Expired'],
        default: 'Pending',
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    acceptedAt: {
        type: Date,
        default: null,
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
}, { timestamps: true });

// Index for faster lookups
invitationSchema.index({ email: 1, campaignId: 1 });
invitationSchema.index({ token: 1 });
invitationSchema.index({ expiresAt: 1 });

// Static method to create invitation with token
invitationSchema.statics.createInvitation = async function(email, campaignId, invitedBy) {
    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');
    
    const invitation = new this({
        email,
        campaignId,
        invitedBy,
        token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });
    
    await invitation.save();
    return invitation;
};

// Method to check if invitation is valid
invitationSchema.methods.isValid = function() {
    return this.status === 'Pending' && new Date() < this.expiresAt;
};

const Invitation = mongoose.model('Invitation', invitationSchema);
export default Invitation;

