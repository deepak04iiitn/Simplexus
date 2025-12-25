import Deliverable from '../models/deliverable.model.js';
import Campaign from '../models/campaign.model.js';
import Review from '../models/review.model.js';
import { errorHandler } from '../utils/error.js';

export const createDeliverable = async (req, res, next) => {
    try {
        const { campaignId, creatorId, platform, contentType, dueDate } = req.body;
        const userId = req.user.id;

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Check permissions
        const isOwner = campaign.brandId.toString() === userId;
        const isAdmin = campaign.teamMembers.some(
            m => m.userId.toString() === userId && ['Owner', 'Admin'].includes(m.role)
        );

        if (!isOwner && !isAdmin) {
            return next(errorHandler(403, 'Only owners and admins can create deliverables'));
        }

        const deliverable = new Deliverable({
            campaignId,
            creatorId,
            platform,
            contentType,
            dueDate: new Date(dueDate),
            status: 'Pending',
        });

        await deliverable.save();
        res.status(201).json({ success: true, deliverable });
    } catch (error) {
        next(error);
    }
};

export const getDeliverables = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const userId = req.user.id;

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Check access
        const hasAccess = 
            campaign.brandId.toString() === userId ||
            (campaign.agencyId && campaign.agencyId.toString() === userId) ||
            campaign.teamMembers.some(m => m.userId.toString() === userId) ||
            campaign.assignedCreators.some(c => c.creatorId.toString() === userId);

        if (!hasAccess) {
            return next(errorHandler(403, 'Access denied'));
        }

        let query = { campaignId };
        if (req.user.userType === 'Creator') {
            query.creatorId = userId;
        }

        const deliverables = await Deliverable.find(query)
            .populate('creatorId', 'username email profilePicture')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, deliverables });
    } catch (error) {
        next(error);
    }
};

export const submitDraft = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { videoLink, thumbnailLink, driveLink, dropboxLink, notes } = req.body;
        const userId = req.user.id;

        const deliverable = await Deliverable.findById(id);
        if (!deliverable) {
            return next(errorHandler(404, 'Deliverable not found'));
        }

        if (deliverable.creatorId.toString() !== userId) {
            return next(errorHandler(403, 'Only the assigned creator can submit drafts'));
        }

        const newVersion = deliverable.currentVersion + 1;

        deliverable.drafts.push({
            version: newVersion,
            videoLink,
            thumbnailLink,
            driveLink,
            dropboxLink,
            notes,
            status: 'Submitted',
        });

        deliverable.currentVersion = newVersion;
        deliverable.status = 'Draft Submitted';

        await deliverable.save();

        const updated = await Deliverable.findById(id)
            .populate('creatorId', 'username email profilePicture');

        res.status(200).json({ success: true, deliverable: updated });
    } catch (error) {
        next(error);
    }
};

export const submitPostProof = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { postUrl, screenshotUrl, postTimestamp, caption, hashtags } = req.body;
        const userId = req.user.id;

        const deliverable = await Deliverable.findById(id);
        if (!deliverable) {
            return next(errorHandler(404, 'Deliverable not found'));
        }

        if (deliverable.creatorId.toString() !== userId) {
            return next(errorHandler(403, 'Only the assigned creator can submit post proof'));
        }

        if (deliverable.status !== 'Approved') {
            return next(errorHandler(400, 'Content must be approved before posting'));
        }

        deliverable.postingDetails = {
            postUrl,
            screenshotUrl,
            postTimestamp: new Date(postTimestamp),
            caption,
            hashtags: hashtags || [],
        };

        deliverable.status = 'Posted';

        await deliverable.save();

        res.status(200).json({ success: true, deliverable });
    } catch (error) {
        next(error);
    }
};

export const updatePerformance = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { views, likes, shares, saves, comments, engagementRate } = req.body;
        const userId = req.user.id;

        const deliverable = await Deliverable.findById(id);
        if (!deliverable) {
            return next(errorHandler(404, 'Deliverable not found'));
        }

        // Check access
        const campaign = await Campaign.findById(deliverable.campaignId);
        const hasAccess = 
            campaign.brandId.toString() === userId ||
            (campaign.agencyId && campaign.agencyId.toString() === userId) ||
            campaign.teamMembers.some(m => m.userId.toString() === userId) ||
            deliverable.creatorId.toString() === userId;

        if (!hasAccess) {
            return next(errorHandler(403, 'Access denied'));
        }

        deliverable.performance = {
            views,
            likes,
            shares,
            saves,
            comments,
            engagementRate,
            updatedAt: new Date(),
        };

        await deliverable.save();

        res.status(200).json({ success: true, deliverable });
    } catch (error) {
        next(error);
    }
};

export const getDeliverable = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deliverable = await Deliverable.findById(id)
            .populate('creatorId', 'username email profilePicture')
            .populate('campaignId', 'name brandId');

        if (!deliverable) {
            return next(errorHandler(404, 'Deliverable not found'));
        }

        const campaign = await Campaign.findById(deliverable.campaignId);
        const hasAccess = 
            campaign.brandId.toString() === userId ||
            (campaign.agencyId && campaign.agencyId.toString() === userId) ||
            campaign.teamMembers.some(m => m.userId.toString() === userId) ||
            deliverable.creatorId.toString() === userId;

        if (!hasAccess) {
            return next(errorHandler(403, 'Access denied'));
        }

        res.status(200).json({ success: true, deliverable });
    } catch (error) {
        next(error);
    }
};

