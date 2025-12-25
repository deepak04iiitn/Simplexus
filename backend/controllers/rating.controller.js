import Rating from '../models/rating.model.js';
import Campaign from '../models/campaign.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const createRating = async (req, res, next) => {
    try {
        const { campaignId, toUserId, rating, comment } = req.body;
        const fromUserId = req.user.id;

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Check if user is part of the campaign
        const isPartOfCampaign = 
            campaign.brandId.toString() === fromUserId ||
            campaign.brandId.toString() === toUserId ||
            (campaign.agencyId && (campaign.agencyId.toString() === fromUserId || campaign.agencyId.toString() === toUserId)) ||
            campaign.assignedCreators.some(c => 
                c.creatorId.toString() === fromUserId || c.creatorId.toString() === toUserId
            );

        if (!isPartOfCampaign) {
            return next(errorHandler(403, 'You can only rate participants in your campaigns'));
        }

        if (rating < 1 || rating > 5) {
            return next(errorHandler(400, 'Rating must be between 1 and 5'));
        }

        // Determine category
        const fromUser = await User.findById(fromUserId);
        const toUser = await User.findById(toUserId);

        let category = '';
        if (fromUser.userType === 'Brand' && toUser.userType === 'Creator') {
            category = 'Brand to Creator';
        } else if (fromUser.userType === 'Creator' && toUser.userType === 'Brand') {
            category = 'Creator to Brand';
        } else if (fromUser.userType === 'Agency' && toUser.userType === 'Creator') {
            category = 'Agency to Creator';
        } else if (fromUser.userType === 'Creator' && toUser.userType === 'Agency') {
            category = 'Creator to Agency';
        }

        // Check if rating already exists
        const existingRating = await Rating.findOne({
            campaignId,
            fromUserId,
            toUserId,
        });

        if (existingRating) {
            existingRating.rating = rating;
            existingRating.comment = comment;
            existingRating.category = category;
            await existingRating.save();

            const updated = await Rating.findById(existingRating._id)
                .populate('fromUserId', 'username email profilePicture')
                .populate('toUserId', 'username email profilePicture');

            return res.status(200).json({ success: true, rating: updated });
        }

        const newRating = new Rating({
            campaignId,
            fromUserId,
            toUserId,
            rating,
            comment,
            category,
        });

        await newRating.save();

        const saved = await Rating.findById(newRating._id)
            .populate('fromUserId', 'username email profilePicture')
            .populate('toUserId', 'username email profilePicture');

        res.status(201).json({ success: true, rating: saved });
    } catch (error) {
        next(error);
    }
};

export const getRatings = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const ratings = await Rating.find({ toUserId: userId })
            .populate('fromUserId', 'username email profilePicture userType')
            .populate('campaignId', 'name')
            .sort({ createdAt: -1 });

        const average = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0;

        res.status(200).json({ 
            success: true, 
            ratings,
            average: Math.round(average * 10) / 10,
            total: ratings.length,
        });
    } catch (error) {
        next(error);
    }
};

