import Campaign from '../models/campaign.model.js';
import Brief from '../models/brief.model.js';
import Deliverable from '../models/deliverable.model.js';
import User from '../models/user.model.js';
import Invitation from '../models/invitation.model.js';
import { errorHandler } from '../utils/error.js';
import { sendCreatorInvitationEmail, sendExternalCreatorInvitationEmail } from '../utils/email.util.js';

export const createCampaign = async (req, res, next) => {
    try {
        const { name, platforms, numberOfCreators, timeline, agencyId } = req.body;
        const brandId = req.user.id;

        const campaign = new Campaign({
            name,
            brandId,
            agencyId: agencyId || null,
            platforms,
            numberOfCreators,
            timeline: {
                startDate: new Date(timeline.startDate),
                endDate: new Date(timeline.endDate),
            },
            status: 'Draft',
            teamMembers: [{
                userId: brandId,
                role: 'Owner',
            }],
        });

        await campaign.save();
        res.status(201).json({ success: true, campaign });
    } catch (error) {
        next(error);
    }
};

export const getCampaigns = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userType = req.user.userType;

        let query = {};
        if (userType === 'Brand') {
            query.brandId = userId;
        } else if (userType === 'Agency') {
            query.$or = [{ agencyId: userId }, { 'teamMembers.userId': userId }];
        } else if (userType === 'Creator') {
            query['assignedCreators.creatorId'] = userId;
        }

        const campaigns = await Campaign.find(query)
            .populate('brandId', 'username email profilePicture')
            .populate('agencyId', 'username email profilePicture')
            .populate('assignedCreators.creatorId', 'username email profilePicture')
            .populate('briefId')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, campaigns });
    } catch (error) {
        next(error);
    }
};

export const getCampaign = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const campaign = await Campaign.findById(id)
            .populate('brandId', 'username email profilePicture')
            .populate('agencyId', 'username email profilePicture')
            .populate('assignedCreators.creatorId', 'username email profilePicture')
            .populate('teamMembers.userId', 'username email profilePicture')
            .populate('briefId');

        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Check access
        const isBrand = campaign.brandId._id.toString() === userId;
        const isAgency = campaign.agencyId && campaign.agencyId._id.toString() === userId;
        const isTeamMember = campaign.teamMembers.some(m => m.userId._id.toString() === userId);
        const isAssignedCreator = campaign.assignedCreators.some(c => c.creatorId._id.toString() === userId);
        const hasAccess = isBrand || isAgency || isTeamMember || isAssignedCreator;

        if (!hasAccess) {
            return next(errorHandler(403, 'Access denied'));
        }

        // For creators, filter out sensitive data
        const campaignData = campaign.toObject();
        if (isAssignedCreator && !isBrand && !isAgency && !isTeamMember) {
            // Only show creator's own assignment
            const creatorAssignment = campaign.assignedCreators.find(
                c => c.creatorId._id.toString() === userId
            );
            campaignData.assignedCreators = creatorAssignment ? [creatorAssignment] : [];
            // Remove team members data
            campaignData.teamMembers = [];
        }

        res.status(200).json({ success: true, campaign: campaignData });
    } catch (error) {
        next(error);
    }
};

export const updateCampaign = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const updates = req.body;

        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Check if user is owner or admin
        const isOwner = campaign.brandId.toString() === userId;
        const isAdmin = campaign.teamMembers.some(
            m => m.userId.toString() === userId && ['Owner', 'Admin'].includes(m.role)
        );

        if (!isOwner && !isAdmin) {
            return next(errorHandler(403, 'Only owners and admins can update campaigns'));
        }

        if (updates.timeline) {
            updates.timeline = {
                startDate: new Date(updates.timeline.startDate),
                endDate: new Date(updates.timeline.endDate),
            };
        }

        const updatedCampaign = await Campaign.findByIdAndUpdate(id, updates, { new: true })
            .populate('brandId', 'username email profilePicture')
            .populate('assignedCreators.creatorId', 'username email profilePicture');

        res.status(200).json({ success: true, campaign: updatedCampaign });
    } catch (error) {
        next(error);
    }
};

export const assignCreators = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { creatorIds } = req.body;
        const userId = req.user.id;

        const campaign = await Campaign.findById(id)
            .populate('brandId', 'username email');
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Check permissions
        const isOwner = campaign.brandId._id.toString() === userId;
        const isAdmin = campaign.teamMembers.some(
            m => m.userId.toString() === userId && ['Owner', 'Admin'].includes(m.role)
        );

        if (!isOwner && !isAdmin) {
            return next(errorHandler(403, 'Only owners and admins can assign creators'));
        }

        // Track creators to invite
        const creatorsToInvite = [];

        // Check each creator and create invitations (don't assign yet - they must accept)
        for (const creatorId of creatorIds) {
            // Check if already assigned
            const alreadyAssigned = campaign.assignedCreators.some(
                c => c.creatorId.toString() === creatorId
            );
            
            if (!alreadyAssigned) {
                const creator = await User.findById(creatorId);
                if (creator && creator.email) {
                    // Check if invitation already exists
                    const existingInvitation = await Invitation.findOne({
                        email: creator.email.toLowerCase(),
                        campaignId: id,
                        status: 'Pending'
                    });

                    if (!existingInvitation) {
                        creatorsToInvite.push(creator);
                    }
                }
            }
        }

        // Create invitations and send emails
        const createdInvitations = [];
        if (creatorsToInvite.length > 0) {
            try {
                const brandName = campaign.brandId.username || campaign.brandId.email;
                
                for (const creator of creatorsToInvite) {
                    // Create invitation
                    const invitation = await Invitation.createInvitation(
                        creator.email.toLowerCase(),
                        id,
                        userId
                    );
                    createdInvitations.push(invitation);

                    // Send invitation email with token
                    await sendCreatorInvitationEmail(
                        creator.email,
                        creator.username,
                        campaign.name,
                        brandName,
                        invitation.token
                    );
                }
            } catch (emailError) {
                // Log email error but don't fail the request
                console.error('Error sending invitation emails:', emailError);
            }
        }

        // Get all pending invitations for this campaign to show in response
        const pendingInvitations = await Invitation.find({
            campaignId: id,
            status: 'Pending'
        }).populate('invitedBy', 'username email');

        const updatedCampaign = await Campaign.findById(id)
            .populate('assignedCreators.creatorId', 'username email profilePicture');

        res.status(200).json({ 
            success: true, 
            campaign: updatedCampaign,
            invitationsSent: createdInvitations.length,
            message: `Invitation emails sent to ${createdInvitations.length} creator(s). They must accept the invitation to be assigned.`
        });
    } catch (error) {
        next(error);
    }
};

export const acceptInvitation = async (req, res, next) => {
    try {
        const { token } = req.params;
        const userId = req.user.id;

        const invitation = await Invitation.findOne({ token });
        if (!invitation) {
            return next(errorHandler(404, 'Invitation not found'));
        }

        // Check if invitation is already accepted
        if (invitation.status === 'Accepted') {
            // Check if creator is already assigned
            const campaign = await Campaign.findById(invitation.campaignId);
            if (campaign && campaign.assignedCreators.some(c => c.creatorId.toString() === userId)) {
                return res.status(200).json({ 
                    success: true, 
                    message: 'Invitation already accepted',
                    campaign: campaign._id
                });
            }
        }
        
        if (!invitation.isValid()) {
            // Update status to Expired if it's past expiration
            if (invitation.status === 'Pending' && invitation.expiresAt && new Date() >= new Date(invitation.expiresAt)) {
                invitation.status = 'Expired';
                await invitation.save();
            }
            return next(errorHandler(400, 'Invitation has expired or is no longer valid'));
        }

        // Verify the user's email matches the invitation
        const user = await User.findById(userId);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        if (!user.email) {
            return next(errorHandler(400, 'User email is missing'));
        }

        // Normalize both emails (trim whitespace and convert to lowercase) for comparison
        const normalizedUserEmail = user.email.trim().toLowerCase();
        const normalizedInvitationEmail = invitation.email ? invitation.email.trim().toLowerCase() : '';
        
        // Debug logging (remove in production if needed)
        console.log('Email comparison:', {
            userEmail: user.email,
            normalizedUserEmail,
            invitationEmail: invitation.email,
            normalizedInvitationEmail,
            match: normalizedUserEmail === normalizedInvitationEmail
        });

        if (normalizedUserEmail !== normalizedInvitationEmail) {
            return next(errorHandler(403, 'This invitation is not for your account. Please ensure you are logged in with the email address that received the invitation.'));
        }

        const campaign = await Campaign.findById(invitation.campaignId);
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Check if already assigned
        const alreadyAssigned = campaign.assignedCreators.some(
            c => c.creatorId.toString() === userId
        );

        if (alreadyAssigned) {
            return next(errorHandler(400, 'You are already assigned to this campaign'));
        }

        // Assign creator to campaign
        campaign.assignedCreators.push({
            creatorId: userId,
            acknowledgmentStatus: 'Pending',
        });
        await campaign.save();

        // Mark invitation as accepted
        invitation.status = 'Accepted';
        invitation.acceptedAt = new Date();
        invitation.acceptedBy = userId;
        await invitation.save();

        res.status(200).json({ 
            success: true, 
            message: 'Invitation accepted successfully',
            campaign: campaign._id
        });
    } catch (error) {
        next(error);
    }
};

export const acknowledgeBrief = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        const creatorAssignment = campaign.assignedCreators.find(
            c => c.creatorId.toString() === userId
        );

        if (!creatorAssignment) {
            return next(errorHandler(403, 'You are not assigned to this campaign'));
        }

        creatorAssignment.acknowledgedAt = new Date();
        creatorAssignment.acknowledgmentStatus = 'Acknowledged';

        await campaign.save();

        res.status(200).json({ success: true, message: 'Brief acknowledged successfully' });
    } catch (error) {
        next(error);
    }
};

export const removeCreator = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { creatorId } = req.body;
        const userId = req.user.id;

        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Check permissions - only owner or admin can remove creators
        const isOwner = campaign.brandId.toString() === userId;
        const isAdmin = campaign.teamMembers.some(
            m => m.userId.toString() === userId && ['Owner', 'Admin'].includes(m.role)
        );

        if (!isOwner && !isAdmin) {
            return next(errorHandler(403, 'Only owners and admins can remove creators'));
        }

        // Remove creator from assigned creators
        campaign.assignedCreators = campaign.assignedCreators.filter(
            c => c.creatorId.toString() !== creatorId
        );
        await campaign.save();

        const updatedCampaign = await Campaign.findById(id)
            .populate('assignedCreators.creatorId', 'username email profilePicture');

        res.status(200).json({ 
            success: true, 
            message: 'Creator removed successfully',
            campaign: updatedCampaign 
        });
    } catch (error) {
        next(error);
    }
};

export const addTeamMember = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userId, role } = req.body;
        const currentUserId = req.user.id;

        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Check if current user is owner or admin
        const isOwner = campaign.brandId.toString() === currentUserId;
        const isAdmin = campaign.teamMembers.some(
            m => m.userId.toString() === currentUserId && ['Owner', 'Admin'].includes(m.role)
        );

        if (!isOwner && !isAdmin) {
            return next(errorHandler(403, 'Only owners and admins can add team members'));
        }

        // Check if user already exists
        const exists = campaign.teamMembers.some(m => m.userId.toString() === userId);
        if (exists) {
            return next(errorHandler(400, 'User is already a team member'));
        }

        campaign.teamMembers.push({ userId, role: role || 'Member' });
        await campaign.save();

        const updatedCampaign = await Campaign.findById(id)
            .populate('teamMembers.userId', 'username email profilePicture');

        res.status(200).json({ success: true, campaign: updatedCampaign });
    } catch (error) {
        next(error);
    }
};

export const deleteCampaign = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        if (campaign.brandId.toString() !== userId) {
            return next(errorHandler(403, 'Only the campaign owner can delete it'));
        }

        await Campaign.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Campaign deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const getCampaignByInvitation = async (req, res, next) => {
    try {
        const { token } = req.params;

        const invitation = await Invitation.findOne({ token })
            .populate('campaignId')
            .populate('invitedBy', 'username email profilePicture');

        if (!invitation) {
            return next(errorHandler(404, 'Invitation not found'));
        }

        // Check if invitation is valid
        if (!invitation.isValid()) {
            // Update status to Expired if it's past expiration
            if (invitation.status === 'Pending' && invitation.expiresAt && new Date() >= new Date(invitation.expiresAt)) {
                invitation.status = 'Expired';
                await invitation.save();
            }
            return next(errorHandler(400, 'Invitation has expired or is no longer valid'));
        }

        const campaign = await Campaign.findById(invitation.campaignId._id)
            .populate('brandId', 'username email profilePicture')
            .populate('briefId')
            .populate('assignedCreators.creatorId', 'username email profilePicture');

        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Get creator assignment if user is logged in
        let creatorAssignment = null;
        if (req.user) {
            creatorAssignment = campaign.assignedCreators.find(
                c => c.creatorId?._id?.toString() === req.user.id
            );
        }

        // Remove other creators' data for privacy
        const campaignData = campaign.toObject();
        campaignData.assignedCreators = creatorAssignment ? [creatorAssignment] : [];
        
        // If creator is not assigned yet, don't show brief details
        if (!creatorAssignment) {
            campaignData.briefId = null; // Hide brief until they accept
        }

        res.status(200).json({
            success: true,
            campaign: {
                ...campaignData,
                invitation: {
                    email: invitation.email,
                    invitedBy: invitation.invitedBy,
                    expiresAt: invitation.expiresAt,
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const inviteExternalCreator = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email } = req.body;
        const userId = req.user.id;

        if (!email || email.trim() === '') {
            return next(errorHandler(400, 'Email is required'));
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(errorHandler(400, 'Invalid email format'));
        }

        const campaign = await Campaign.findById(id)
            .populate('brandId', 'username email');
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Check permissions
        const isOwner = campaign.brandId._id.toString() === userId;
        const isAdmin = campaign.teamMembers.some(
            m => m.userId.toString() === userId && ['Owner', 'Admin'].includes(m.role)
        );

        if (!isOwner && !isAdmin) {
            return next(errorHandler(403, 'Only owners and admins can invite creators'));
        }

        // Check if user already exists with this email
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            // If user exists, check if they're already assigned
            const alreadyAssigned = campaign.assignedCreators.some(
                c => c.creatorId.toString() === existingUser._id.toString()
            );
            if (alreadyAssigned) {
                return next(errorHandler(400, 'This creator is already assigned to the campaign'));
            }
            // If user exists but not assigned, create invitation and send email
            // Don't assign directly - they need to accept invitation
            let invitation = await Invitation.findOne({
                email: email.toLowerCase(),
                campaignId: id,
                status: 'Pending'
            });

            if (!invitation) {
                invitation = await Invitation.createInvitation(
                    email.toLowerCase(),
                    id,
                    userId
                );
            }

            // Send invitation email with token
            const brandName = campaign.brandId.username || campaign.brandId.email;
            await sendCreatorInvitationEmail(
                existingUser.email,
                existingUser.username,
                campaign.name,
                brandName,
                invitation.token
            );

            return res.status(200).json({
                success: true,
                message: 'Creator assigned and invitation email sent',
                isExistingUser: true
            });
        }

        // Check if there's already a pending invitation for this email and campaign
        const existingInvitation = await Invitation.findOne({
            email: email.toLowerCase(),
            campaignId: id,
            status: 'Pending'
        });

        if (existingInvitation && existingInvitation.isValid()) {
            return next(errorHandler(400, 'An invitation has already been sent to this email'));
        }

        // Create new invitation
        const invitation = await Invitation.createInvitation(
            email.toLowerCase(),
            id,
            userId
        );

        // Send external invitation email
        const brandName = campaign.brandId.username || campaign.brandId.email;
        await sendExternalCreatorInvitationEmail(
            email,
            campaign.name,
            brandName,
            invitation.token
        );

        res.status(200).json({
            success: true,
            message: 'Invitation email sent successfully',
            invitation: {
                email: invitation.email,
                expiresAt: invitation.expiresAt
            }
        });
    } catch (error) {
        next(error);
    }
};

