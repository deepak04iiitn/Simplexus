import CreatorProfile from '../models/creatorProfile.model.js';
import User from '../models/user.model.js';
import Deliverable from '../models/deliverable.model.js';
import Campaign from '../models/campaign.model.js';
import Rating from '../models/rating.model.js';
import { errorHandler } from '../utils/error.js';

export const createOrUpdateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        if (req.user.userType !== 'Creator') {
            return next(errorHandler(403, 'Only creators can create profiles'));
        }

        const existingProfile = await CreatorProfile.findOne({ userId });

        const profileData = {
            userId,
            bio: req.body.bio,
            location: req.body.location,
            niche: req.body.niche || [],
            platforms: req.body.platforms || [],
            portfolio: req.body.portfolio || [],
            pricing: req.body.pricing || { packages: [] },
            publicProfileEnabled: req.body.publicProfileEnabled !== undefined ? req.body.publicProfileEnabled : true,
        };

        if (req.body.profileSlug) {
            profileData.profileSlug = req.body.profileSlug;
        }

        let profile;
        if (existingProfile) {
            profile = await CreatorProfile.findByIdAndUpdate(
                existingProfile._id,
                profileData,
                { new: true }
            );
        } else {
            profile = new CreatorProfile(profileData);
            await profile.save();
        }

        // Update stats
        await updateCreatorStats(userId);

        const updated = await CreatorProfile.findById(profile._id)
            .populate('userId', 'username email profilePicture');

        res.status(200).json({ success: true, profile: updated });
    } catch (error) {
        if (error.code === 11000) {
            return next(errorHandler(400, 'Profile slug already exists'));
        }
        next(error);
    }
};

export const getProfile = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user?.id;

        // Verify the user exists and is a Creator
        const user = await User.findById(userId);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        if (user.userType !== 'Creator') {
            return next(errorHandler(400, 'User is not a creator'));
        }

        let profile = await CreatorProfile.findOne({ userId })
            .populate('userId', 'username email profilePicture userType')
            .populate('testimonials.fromUserId', 'username email profilePicture');

        // If profile doesn't exist and user is viewing their own profile, create a basic one
        if (!profile && userId === currentUserId) {
            profile = new CreatorProfile({
                userId,
                bio: '',
                location: {},
                niche: [],
                platforms: [],
                portfolio: [],
                pricing: { packages: [] },
                publicProfileEnabled: true,
            });
            await profile.save();
            await profile.populate('userId', 'username email profilePicture userType');
        }

        if (!profile) {
            return next(errorHandler(404, 'Profile not found'));
        }

        // Check if profile is public or user is viewing their own
        if (!profile.publicProfileEnabled && userId !== currentUserId?.toString()) {
            return next(errorHandler(403, 'Profile is private'));
        }

        res.status(200).json({ success: true, profile });
    } catch (error) {
        next(error);
    }
};

export const getProfileBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;

        const profile = await CreatorProfile.findOne({ profileSlug: slug })
            .populate('userId', 'username email profilePicture userType')
            .populate('testimonials.fromUserId', 'username email profilePicture');

        if (!profile) {
            return next(errorHandler(404, 'Profile not found'));
        }

        if (!profile.publicProfileEnabled) {
            return next(errorHandler(403, 'Profile is private'));
        }

        res.status(200).json({ success: true, profile });
    } catch (error) {
        next(error);
    }
};

export const addPortfolioItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { title, description, mediaUrl, mediaType, campaignId, deliverableId } = req.body;

        const profile = await CreatorProfile.findOne({ userId });
        if (!profile) {
            return next(errorHandler(404, 'Profile not found'));
        }

        profile.portfolio.push({
            title,
            description,
            mediaUrl,
            mediaType,
            campaignId,
            deliverableId,
        });

        await profile.save();

        res.status(200).json({ success: true, profile });
    } catch (error) {
        next(error);
    }
};

export const generateResume = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user?.id;

        // Only creator can generate their own resume, or brands/agencies viewing public profile
        if (userId !== currentUserId) {
            const profile = await CreatorProfile.findOne({ userId });
            if (!profile || !profile.publicProfileEnabled) {
                return next(errorHandler(403, 'Access denied'));
            }
        }

        const user = await User.findById(userId);
        if (!user || user.userType !== 'Creator') {
            return next(errorHandler(404, 'Creator not found'));
        }

        const profile = await CreatorProfile.findOne({ userId });
        const campaigns = await Campaign.find({ 
            'assignedCreators.creatorId': userId,
            status: 'Completed',
        })
            .populate('brandId', 'username')
            .populate('agencyId', 'username');

        const deliverables = await Deliverable.find({ creatorId: userId })
            .populate('campaignId', 'name');

        const ratings = await Rating.find({ toUserId: userId });

        const resume = {
            creator: {
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: profile?.bio || '',
                location: profile?.location || {},
                niche: profile?.niche || [],
            },
            brandsWorkedWith: [...new Set(campaigns.map(c => c.brandId.username))],
            agenciesWorkedWith: [...new Set(campaigns.filter(c => c.agencyId).map(c => c.agencyId.username))],
            campaignHistory: campaigns.map(c => ({
                campaignName: c.name,
                brand: c.brandId.username,
                agency: c.agencyId ? c.agencyId.username : null,
                completedAt: c.updatedAt,
            })),
            deliverableStats: {
                total: deliverables.length,
                completed: deliverables.filter(d => d.status === 'Completed').length,
                onTimeRate: profile?.stats.onTimeRate || 0,
                averageRevisionCount: profile?.stats.averageRevisionCount || 0,
            },
            ratings: {
                average: ratings.length > 0 
                    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
                    : 0,
                total: ratings.length,
                breakdown: [1, 2, 3, 4, 5].map(star => ({
                    star,
                    count: ratings.filter(r => r.rating === star).length,
                })),
            },
            portfolio: profile?.portfolio || [],
        };

        res.status(200).json({ success: true, resume });
    } catch (error) {
        next(error);
    }
};

export const searchCreators = async (req, res, next) => {
    try {
        const { location, niche, platform, minFollowers, maxFollowers } = req.query;

        let query = { publicProfileEnabled: true };

        if (location) {
            query['location.city'] = new RegExp(location, 'i');
        }

        if (niche) {
            query.niche = { $in: [new RegExp(niche, 'i')] };
        }

        if (platform) {
            query['platforms.platform'] = platform;
        }

        if (minFollowers || maxFollowers) {
            query['platforms.followers'] = {};
            if (minFollowers) query['platforms.followers'].$gte = parseInt(minFollowers);
            if (maxFollowers) query['platforms.followers'].$lte = parseInt(maxFollowers);
        }

        const profiles = await CreatorProfile.find(query)
            .populate('userId', 'username email profilePicture')
            .limit(50);

        res.status(200).json({ success: true, profiles });
    } catch (error) {
        next(error);
    }
};

// Helper function to update creator stats
async function updateCreatorStats(userId) {
    const deliverables = await Deliverable.find({ creatorId: userId });
    const campaigns = await Campaign.find({ 
        'assignedCreators.creatorId': userId,
        status: 'Completed',
    });

    const completedDeliverables = deliverables.filter(d => d.status === 'Completed');
    const onTime = completedDeliverables.filter(d => {
        if (!d.postingDetails || !d.postingDetails.postTimestamp) return false;
        return new Date(d.postingDetails.postTimestamp) <= new Date(d.dueDate);
    });

    const totalRevisions = deliverables.reduce((sum, d) => sum + Math.max(0, d.drafts.length - 1), 0);
    const avgRevisions = deliverables.length > 0 ? totalRevisions / deliverables.length : 0;

    await CreatorProfile.findOneAndUpdate(
        { userId },
        {
            $set: {
                'stats.totalCampaigns': campaigns.length,
                'stats.completedDeliverables': completedDeliverables.length,
                'stats.onTimeRate': completedDeliverables.length > 0 
                    ? (onTime.length / completedDeliverables.length) * 100 
                    : 0,
                'stats.averageRevisionCount': avgRevisions,
            },
        }
    );
}

