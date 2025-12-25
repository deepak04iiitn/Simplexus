import Review from '../models/review.model.js';
import Deliverable from '../models/deliverable.model.js';
import Campaign from '../models/campaign.model.js';
import { errorHandler } from '../utils/error.js';

export const createReview = async (req, res, next) => {
    try {
        const { deliverableId, draftVersion, comments, briefItemsStatus, decision, revisionNotes } = req.body;
        const userId = req.user.id;

        const deliverable = await Deliverable.findById(deliverableId);
        if (!deliverable) {
            return next(errorHandler(404, 'Deliverable not found'));
        }

        const campaign = await Campaign.findById(deliverable.campaignId);
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Check permissions - only brand/agency team members can review
        const isOwner = campaign.brandId.toString() === userId;
        const isTeamMember = campaign.teamMembers.some(m => m.userId.toString() === userId);

        if (!isOwner && !isTeamMember) {
            return next(errorHandler(403, 'Only brand and team members can create reviews'));
        }

        const review = new Review({
            deliverableId,
            draftVersion,
            reviewerId: userId,
            comments: comments || [],
            briefItemsStatus: briefItemsStatus || [],
            decision,
            revisionNotes,
            decisionAt: decision ? new Date() : null,
        });

        await review.save();

        // Update deliverable status based on decision
        if (decision === 'Approve') {
            deliverable.status = 'Approved';
            deliverable.approvedVersion = draftVersion;
        } else if (decision === 'Request Revision') {
            deliverable.status = 'Revision Requested';
            // Set revision due date (48 hours from now by default)
            deliverable.revisionDueDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
        } else if (decision === 'Reject') {
            deliverable.status = 'Pending';
        }

        await deliverable.save();

        const updatedReview = await Review.findById(review._id)
            .populate('reviewerId', 'username email profilePicture')
            .populate('comments.taggedUsers', 'username email profilePicture');

        res.status(201).json({ success: true, review: updatedReview });
    } catch (error) {
        next(error);
    }
};

export const getReviews = async (req, res, next) => {
    try {
        const { deliverableId } = req.params;
        const userId = req.user.id;

        const deliverable = await Deliverable.findById(deliverableId);
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

        const reviews = await Review.find({ deliverableId })
            .populate('reviewerId', 'username email profilePicture')
            .populate('comments.taggedUsers', 'username email profilePicture')
            .sort({ createdAt: -1 });

        // Filter internal comments for creators
        const isCreator = deliverable.creatorId.toString() === userId;
        if (isCreator) {
            reviews.forEach(review => {
                review.comments = review.comments.filter(c => !c.isInternal);
            });
        }

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        next(error);
    }
};

export const addComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { type, content, timestamp, briefItemId, taggedUsers, isInternal } = req.body;
        const userId = req.user.id;

        const review = await Review.findById(id);
        if (!review) {
            return next(errorHandler(404, 'Review not found'));
        }

        const deliverable = await Deliverable.findById(review.deliverableId);
        const campaign = await Campaign.findById(deliverable.campaignId);

        // Check access
        const hasAccess = 
            campaign.brandId.toString() === userId ||
            (campaign.agencyId && campaign.agencyId.toString() === userId) ||
            campaign.teamMembers.some(m => m.userId.toString() === userId) ||
            deliverable.creatorId.toString() === userId;

        if (!hasAccess) {
            return next(errorHandler(403, 'Access denied'));
        }

        review.comments.push({
            type,
            content,
            timestamp,
            briefItemId,
            taggedUsers: taggedUsers || [],
            isInternal: isInternal || false,
        });

        await review.save();

        const updated = await Review.findById(id)
            .populate('reviewerId', 'username email profilePicture')
            .populate('comments.taggedUsers', 'username email profilePicture');

        res.status(200).json({ success: true, review: updated });
    } catch (error) {
        next(error);
    }
};

export const verifyPost = async (req, res, next) => {
    try {
        const { deliverableId } = req.params;
        const userId = req.user.id;

        const deliverable = await Deliverable.findById(deliverableId);
        if (!deliverable) {
            return next(errorHandler(404, 'Deliverable not found'));
        }

        if (deliverable.status !== 'Posted') {
            return next(errorHandler(400, 'Deliverable must be posted before verification'));
        }

        const campaign = await Campaign.findById(deliverable.campaignId);
        const isOwner = campaign.brandId.toString() === userId;
        const isAdmin = campaign.teamMembers.some(
            m => m.userId.toString() === userId && ['Owner', 'Admin'].includes(m.role)
        );

        if (!isOwner && !isAdmin) {
            return next(errorHandler(403, 'Only owners and admins can verify posts'));
        }

        deliverable.postingDetails.verified = true;
        deliverable.postingDetails.verifiedAt = new Date();
        deliverable.postingDetails.verifiedBy = userId;
        deliverable.status = 'Completed';

        await deliverable.save();

        res.status(200).json({ success: true, deliverable });
    } catch (error) {
        next(error);
    }
};

