import mongoose from "mongoose";

const briefSchema = new mongoose.Schema({
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true,
    },
    template: {
        type: String,
        enum: ['Review', 'Unboxing', 'Reel', 'Tutorial', 'POV', 'Story', 'Post', 'Video', 'Custom'],
        required: true,
    },
    sections: {
        campaignObjective: {
            type: String,
            default: '',
        },
        keyMessaging: [{
            message: String,
            checked: {
                type: Boolean,
                default: false,
            },
        }],
        dosAndDonts: {
            dos: [String],
            donts: [String],
        },
        scriptDirections: {
            type: String,
            default: '',
        },
        brandAssets: [{
            name: String,
            url: String,
            type: String, // image, video, document
        }],
        hashtags: [String],
        mentions: [String],
        postingTimeline: {
            type: String,
            default: '',
        },
        revisionTimeline: {
            type: String,
            default: '',
        },
        contentGuidelines: {
            type: String,
            default: '',
        },
        examples: [{
            name: String,
            url: String,
            description: String,
        }],
    },
    version: {
        type: Number,
        default: 1,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const Brief = mongoose.model('Brief', briefSchema);
export default Brief;

