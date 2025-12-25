import mongoose from "mongoose";

const creatorProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    bio: {
        type: String,
        default: '',
    },
    location: {
        city: String,
        state: String,
        country: String,
        coordinates: {
            lat: Number,
            lng: Number,
        },
    },
    niche: [String], // e.g., ['Food', 'Travel', 'Fashion']
    platforms: [{
        platform: {
            type: String,
            enum: ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn', 'Facebook'],
        },
        handle: String,
        followers: Number,
        engagementRate: Number,
        verified: {
            type: Boolean,
            default: false,
        },
    }],
    portfolio: [{
        title: String,
        description: String,
        mediaUrl: String,
        mediaType: String, // image, video
        campaignId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Campaign',
        },
        deliverableId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Deliverable',
        },
    }],
    stats: {
        totalCampaigns: {
            type: Number,
            default: 0,
        },
        completedDeliverables: {
            type: Number,
            default: 0,
        },
        onTimeRate: {
            type: Number,
            default: 0,
        },
        averageRevisionCount: {
            type: Number,
            default: 0,
        },
        totalEarnings: {
            type: Number,
            default: 0,
        },
    },
    pricing: {
        packages: [{
            name: String,
            description: String,
            price: Number,
            deliverables: [String],
        }],
    },
    testimonials: [{
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    publicProfileEnabled: {
        type: Boolean,
        default: true,
    },
    profileSlug: {
        type: String,
        unique: true,
        sparse: true,
    },
}, { timestamps: true });

const CreatorProfile = mongoose.model('CreatorProfile', creatorProfileSchema);
export default CreatorProfile;

