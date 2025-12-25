import Brief from '../models/brief.model.js';
import Campaign from '../models/campaign.model.js';
import { errorHandler } from '../utils/error.js';

export const createBrief = async (req, res, next) => {
    try {
        const { campaignId, template, sections } = req.body;
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
            return next(errorHandler(403, 'Only owners and admins can create briefs'));
        }

        const brief = new Brief({
            campaignId,
            template,
            sections: sections || {},
            createdBy: userId,
        });

        await brief.save();

        // Link brief to campaign
        campaign.briefId = brief._id;
        await campaign.save();

        res.status(201).json({ success: true, brief });
    } catch (error) {
        next(error);
    }
};

export const getBrief = async (req, res, next) => {
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

        const brief = await Brief.findOne({ campaignId });
        if (!brief) {
            return next(errorHandler(404, 'Brief not found'));
        }

        res.status(200).json({ success: true, brief });
    } catch (error) {
        next(error);
    }
};

export const updateBrief = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { sections } = req.body;
        const userId = req.user.id;

        const brief = await Brief.findById(id);
        if (!brief) {
            return next(errorHandler(404, 'Brief not found'));
        }

        const campaign = await Campaign.findById(brief.campaignId);
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Check permissions
        const isOwner = campaign.brandId.toString() === userId;
        const isAdmin = campaign.teamMembers.some(
            m => m.userId.toString() === userId && ['Owner', 'Admin'].includes(m.role)
        );

        if (!isOwner && !isAdmin) {
            return next(errorHandler(403, 'Only owners and admins can update briefs'));
        }

        // Increment version if sections changed
        if (sections) {
            brief.version += 1;
            brief.sections = { ...brief.sections, ...sections };
        }

        await brief.save();

        res.status(200).json({ success: true, brief });
    } catch (error) {
        next(error);
    }
};

export const deleteBrief = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const brief = await Brief.findById(id);
        if (!brief) {
            return next(errorHandler(404, 'Brief not found'));
        }

        const campaign = await Campaign.findById(brief.campaignId);
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        if (campaign.brandId.toString() !== userId) {
            return next(errorHandler(403, 'Only the campaign owner can delete briefs'));
        }

        await Brief.findByIdAndDelete(id);
        campaign.briefId = null;
        await campaign.save();

        res.status(200).json({ success: true, message: 'Brief deleted successfully' });
    } catch (error) {
        next(error);
    }
};

