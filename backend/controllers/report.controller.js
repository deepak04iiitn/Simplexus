import Report from '../models/report.model.js';
import Campaign from '../models/campaign.model.js';
import Deliverable from '../models/deliverable.model.js';
import Brief from '../models/brief.model.js';
import Payment from '../models/payment.model.js';
import Review from '../models/review.model.js';
import { errorHandler } from '../utils/error.js';
import crypto from 'crypto';

export const generateReport = async (req, res, next) => {
    try {
        const { campaignId, reportType, format } = req.body;
        const userId = req.user.id;

        const campaign = await Campaign.findById(campaignId)
            .populate('brandId', 'username email')
            .populate('agencyId', 'username email')
            .populate('assignedCreators.creatorId', 'username email profilePicture');

        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        // Check access
        const hasAccess = 
            campaign.brandId._id.toString() === userId ||
            (campaign.agencyId && campaign.agencyId._id.toString() === userId) ||
            campaign.teamMembers.some(m => m.userId.toString() === userId);

        if (!hasAccess) {
            return next(errorHandler(403, 'Access denied'));
        }

        const brief = await Brief.findOne({ campaignId });
        const deliverables = await Deliverable.find({ campaignId })
            .populate('creatorId', 'username email profilePicture');
        const payments = await Payment.find({ campaignId })
            .populate('creatorId', 'username email');
        const reviews = await Review.find({ 
            deliverableId: { $in: deliverables.map(d => d._id) } 
        });

        // Build report data
        const reportData = {
            campaign: {
                name: campaign.name,
                brand: campaign.brandId.username,
                agency: campaign.agencyId ? campaign.agencyId.username : null,
                platforms: campaign.platforms,
                timeline: campaign.timeline,
                status: campaign.status,
            },
            brief: brief ? {
                template: brief.template,
                objective: brief.sections.campaignObjective,
                keyMessaging: brief.sections.keyMessaging,
                dosAndDonts: brief.sections.dosAndDonts,
                hashtags: brief.sections.hashtags,
                mentions: brief.sections.mentions,
            } : null,
            deliverables: deliverables.map(d => ({
                creator: d.creatorId.username,
                platform: d.platform,
                contentType: d.contentType,
                status: d.status,
                drafts: d.drafts.length,
                approvedVersion: d.approvedVersion,
                postingDetails: d.postingDetails,
                performance: d.performance,
                dueDate: d.dueDate,
                submittedAt: d.drafts[d.drafts.length - 1]?.submittedAt,
            })),
            payments: payments.map(p => ({
                creator: p.creatorId.username,
                amount: p.amount,
                currency: p.currency,
                status: p.status,
                paymentDate: p.paymentDate,
                transactionId: p.transactionId,
            })),
            timeline: buildTimeline(campaign, deliverables, reviews, payments),
            statistics: {
                totalDeliverables: deliverables.length,
                completed: deliverables.filter(d => d.status === 'Completed').length,
                approved: deliverables.filter(d => d.status === 'Approved' || d.status === 'Completed').length,
                totalRevisions: deliverables.reduce((sum, d) => sum + d.drafts.length - 1, 0),
                onTimeRate: calculateOnTimeRate(deliverables),
                totalPayments: payments.length,
                totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
            },
        };

        // Generate shareable link if format is Web
        let shareableLink = null;
        if (format === 'Web') {
            shareableLink = crypto.randomBytes(16).toString('hex');
        }

        const report = new Report({
            campaignId,
            generatedBy: userId,
            reportType: reportType || 'Campaign',
            format: format || 'PDF',
            shareableLink,
            data: reportData,
        });

        await report.save();

        res.status(201).json({ 
            success: true, 
            report,
            reportData,
            shareableLink: shareableLink ? `/report/${shareableLink}` : null,
        });
    } catch (error) {
        next(error);
    }
};

export const getReport = async (req, res, next) => {
    try {
        const { id } = req.params;
        const report = await Report.findById(id)
            .populate('generatedBy', 'username email')
            .populate('campaignId', 'name');

        if (!report) {
            return next(errorHandler(404, 'Report not found'));
        }

        res.status(200).json({ success: true, report });
    } catch (error) {
        next(error);
    }
};

export const getReportsByCampaign = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const reports = await Report.find({ campaignId })
            .populate('generatedBy', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, reports });
    } catch (error) {
        next(error);
    }
};

export const getReportByLink = async (req, res, next) => {
    try {
        const { link } = req.params;
        const report = await Report.findOne({ shareableLink: link })
            .populate('generatedBy', 'username email')
            .populate('campaignId', 'name');

        if (!report) {
            return next(errorHandler(404, 'Report not found'));
        }

        res.status(200).json({ success: true, report });
    } catch (error) {
        next(error);
    }
};

export const shareReport = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { emails } = req.body;

        const report = await Report.findById(id);
        if (!report) {
            return next(errorHandler(404, 'Report not found'));
        }

        if (!report.shareableLink) {
            report.shareableLink = crypto.randomBytes(16).toString('hex');
        }

        emails.forEach(email => {
            const exists = report.sharedWith.some(s => s.email === email);
            if (!exists) {
                report.sharedWith.push({ email, sharedAt: new Date() });
            }
        });

        await report.save();

        res.status(200).json({ 
            success: true, 
            message: 'Report shared successfully',
            shareableLink: `/report/${report.shareableLink}`,
        });
    } catch (error) {
        next(error);
    }
};

// Helper functions
function buildTimeline(campaign, deliverables, reviews, payments) {
    const timeline = [];

    timeline.push({
        date: campaign.createdAt,
        action: 'Campaign Created',
        actor: 'Brand',
    });

    deliverables.forEach(d => {
        if (d.drafts.length > 0) {
            d.drafts.forEach((draft, idx) => {
                timeline.push({
                    date: draft.submittedAt,
                    action: `Draft v${draft.version} Submitted`,
                    actor: d.creatorId.username,
                    deliverable: d.contentType,
                });
            });
        }

        if (d.postingDetails && d.postingDetails.postTimestamp) {
            timeline.push({
                date: d.postingDetails.postTimestamp,
                action: 'Post Published',
                actor: d.creatorId.username,
                deliverable: d.contentType,
                url: d.postingDetails.postUrl,
            });
        }
    });

    reviews.forEach(r => {
        if (r.decisionAt) {
            timeline.push({
                date: r.decisionAt,
                action: `Review Decision: ${r.decision}`,
                actor: 'Brand',
            });
        }
    });

    payments.forEach(p => {
        if (p.paymentDate) {
            timeline.push({
                date: p.paymentDate,
                action: 'Payment Released',
                actor: 'Brand',
                amount: p.amount,
                creator: p.creatorId.username,
            });
        }
    });

    return timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function calculateOnTimeRate(deliverables) {
    if (deliverables.length === 0) return 0;
    const onTime = deliverables.filter(d => {
        if (!d.postingDetails || !d.postingDetails.postTimestamp) return false;
        return new Date(d.postingDetails.postTimestamp) <= new Date(d.dueDate);
    }).length;
    return (onTime / deliverables.length) * 100;
}

