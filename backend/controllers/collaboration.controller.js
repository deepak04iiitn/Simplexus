import Campaign from '../models/campaign.model.js';
import Deliverable from '../models/deliverable.model.js';
import Review from '../models/review.model.js';
import Message from '../models/message.model.js';
import { errorHandler } from '../utils/error.js';

// Get collaboration dashboard data
export const getCollaborationData = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const { creatorId } = req.query;
        const userId = req.user.id;

        const campaign = await Campaign.findById(campaignId)
            .populate('brandId', 'username email profilePicture')
            .populate('assignedCreators.creatorId', 'username email profilePicture')
            .populate('briefId');

        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Check access permissions
        const isBrand = campaign.brandId._id.toString() === userId;
        const isAgency = campaign.agencyId && campaign.agencyId.toString() === userId;
        const isTeamMember = campaign.teamMembers.some(m => m.userId.toString() === userId);
        const isAssignedCreator = campaign.assignedCreators.some(
            c => c.creatorId._id.toString() === userId
        );

        if (!isBrand && !isAgency && !isTeamMember && !isAssignedCreator) {
            return next(errorHandler(403, 'Access denied'));
        }

        // If creatorId is specified, verify it's an assigned creator
        let targetCreator = null;
        if (creatorId) {
            const assignment = campaign.assignedCreators.find(
                c => c.creatorId._id.toString() === creatorId
            );
            if (!assignment) {
                return next(errorHandler(404, 'Creator not assigned to this campaign'));
            }
            targetCreator = assignment.creatorId;
        }

        res.status(200).json({
            success: true,
            campaign,
            targetCreator,
        });
    } catch (error) {
        next(error);
    }
};

// Get or create collaboration messages
export const getMessages = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const { creatorId } = req.query;
        const userId = req.user.id;

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Check access permissions
        const isBrand = campaign.brandId.toString() === userId;
        const isAgency = campaign.agencyId && campaign.agencyId.toString() === userId;
        const isTeamMember = campaign.teamMembers.some(m => m.userId.toString() === userId);
        const isCreator = campaign.assignedCreators.some(
            c => c.creatorId.toString() === userId
        );

        if (!isBrand && !isAgency && !isTeamMember && !isCreator) {
            return next(errorHandler(403, 'Access denied'));
        }

        // Build query
        const query = { campaignId };
        if (creatorId) {
            query.creatorId = creatorId;
        } else if (isCreator) {
            // Creator sees messages for themselves
            query.creatorId = userId;
        }

        // Get messages - creators see all messages (internal and external)
        // Brands/agencies see all messages for the specific creator
        const messages = await Message.find(query)
            .populate('senderId', 'username email profilePicture userType')
            .populate('taggedUsers', 'username email profilePicture')
            .sort({ createdAt: 1 });

        // Mark messages as read
        const unreadMessages = messages.filter(msg => 
            !msg.readBy.some(r => r.userId.toString() === userId)
        );

        if (unreadMessages.length > 0) {
            await Message.updateMany(
                { _id: { $in: unreadMessages.map(m => m._id) } },
                { $push: { readBy: { userId, readAt: new Date() } } }
            );
        }

        res.status(200).json({
            success: true,
            messages,
        });
    } catch (error) {
        next(error);
    }
};

// Send collaboration message
export const sendMessage = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const { creatorId, content, isInternal, taggedUsers } = req.body;
        const userId = req.user.id;

        if (!content || !content.trim()) {
            return next(errorHandler(400, 'Message content is required'));
        }

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Check permissions
        const isBrand = campaign.brandId.toString() === userId;
        const isAgency = campaign.agencyId && campaign.agencyId.toString() === userId;
        const isTeamMember = campaign.teamMembers.some(m => m.userId.toString() === userId);
        const isCreator = campaign.assignedCreators.some(
            c => c.creatorId.toString() === userId
        );

        if (!isBrand && !isAgency && !isTeamMember && !isCreator) {
            return next(errorHandler(403, 'Access denied'));
        }

        // Determine target creator
        let targetCreatorId = creatorId;
        if (isCreator && !targetCreatorId) {
            // Creator sending message - target is themselves
            targetCreatorId = userId;
        }

        if (!targetCreatorId) {
            return next(errorHandler(400, 'Creator ID is required'));
        }

        // Verify creator is assigned to campaign
        const creatorAssignment = campaign.assignedCreators.find(
            c => c.creatorId.toString() === targetCreatorId
        );
        if (!creatorAssignment) {
            return next(errorHandler(404, 'Creator not assigned to this campaign'));
        }

        // Create message
        const message = new Message({
            campaignId,
            creatorId: targetCreatorId,
            senderId: userId,
            content: content.trim(),
            isInternal: isInternal || false,
            taggedUsers: taggedUsers || [],
        });

        await message.save();

        // Populate sender info
        await message.populate('senderId', 'username email profilePicture userType');
        await message.populate('taggedUsers', 'username email profilePicture');

        res.status(201).json({
            success: true,
            message,
        });
    } catch (error) {
        next(error);
    }
};

// Get collaboration timeline
export const getTimeline = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const { creatorId } = req.query;
        const userId = req.user.id;

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Build query for deliverables
        const query = { campaignId };
        if (creatorId) {
            query.creatorId = creatorId;
        }

        const deliverables = await Deliverable.find(query)
            .populate('creatorId', 'username email profilePicture')
            .sort({ createdAt: -1 });

        const timeline = [];

        // Add campaign start
        timeline.push({
            type: 'campaign_start',
            date: campaign.timeline.startDate,
            title: 'Campaign Started',
        });

        // Add deliverable events
        deliverables.forEach((deliverable) => {
            if (deliverable.drafts && deliverable.drafts.length > 0) {
                deliverable.drafts.forEach((draft) => {
                    timeline.push({
                        type: 'draft_submitted',
                        date: draft.submittedAt,
                        title: `Draft V${draft.version} Submitted`,
                        deliverableId: deliverable._id,
                        deliverable: {
                            contentType: deliverable.contentType,
                            platform: deliverable.platform,
                        },
                    });
                });
            }

            if (deliverable.postingDetails?.postTimestamp) {
                timeline.push({
                    type: 'content_posted',
                    date: deliverable.postingDetails.postTimestamp,
                    title: 'Content Posted',
                    deliverableId: deliverable._id,
                    deliverable: {
                        contentType: deliverable.contentType,
                        platform: deliverable.platform,
                    },
                });
            }
        });

        // Sort by date
        timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.status(200).json({
            success: true,
            timeline,
        });
    } catch (error) {
        next(error);
    }
};

