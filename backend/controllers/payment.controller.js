import Payment from '../models/payment.model.js';
import Deliverable from '../models/deliverable.model.js';
import Campaign from '../models/campaign.model.js';
import { errorHandler } from '../utils/error.js';

export const createPayment = async (req, res, next) => {
    try {
        const { campaignId, deliverableIds, creatorId, amount, currency, paymentMethod, transactionId, paymentDate, notes } = req.body;
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
            return next(errorHandler(403, 'Only owners and admins can create payments'));
        }

        // Verify deliverables are completed
        if (deliverableIds && deliverableIds.length > 0) {
            const deliverables = await Deliverable.find({ _id: { $in: deliverableIds } });
            const allCompleted = deliverables.every(d => d.status === 'Completed');
            if (!allCompleted) {
                return next(errorHandler(400, 'All deliverables must be completed before payment'));
            }
        }

        const payment = new Payment({
            campaignId,
            deliverableIds: deliverableIds || [],
            creatorId,
            brandId: campaign.brandId,
            amount,
            currency: currency || 'USD',
            status: 'Paid',
            paymentMethod: paymentMethod || 'Other',
            transactionId,
            paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
            paidBy: userId,
            notes,
        });

        await payment.save();

        res.status(201).json({ success: true, payment });
    } catch (error) {
        next(error);
    }
};

export const getPayments = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const userId = req.user.id;
        const userType = req.user.userType;

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return next(errorHandler(404, 'Campaign not found'));
        }

        let query = { campaignId };
        if (userType === 'Creator') {
            query.creatorId = userId;
        } else {
            // Brand/Agency can see all payments
            query.brandId = campaign.brandId;
        }

        const payments = await Payment.find(query)
            .populate('creatorId', 'username email profilePicture')
            .populate('deliverableIds')
            .populate('paidBy', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, payments });
    } catch (error) {
        next(error);
    }
};

export const triggerPayment = async (req, res, next) => {
    try {
        const { deliverableId } = req.params;
        const userId = req.user.id;

        const deliverable = await Deliverable.findById(deliverableId);
        if (!deliverable) {
            return next(errorHandler(404, 'Deliverable not found'));
        }

        if (deliverable.status !== 'Completed' || !deliverable.postingDetails.verified) {
            return next(errorHandler(400, 'Deliverable must be verified before triggering payment'));
        }

        const campaign = await Campaign.findById(deliverable.campaignId);
        const isOwner = campaign.brandId.toString() === userId;
        const isAdmin = campaign.teamMembers.some(
            m => m.userId.toString() === userId && ['Owner', 'Admin'].includes(m.role)
        );

        if (!isOwner && !isAdmin) {
            return next(errorHandler(403, 'Only owners and admins can trigger payments'));
        }

        // Check if payment already exists
        const existingPayment = await Payment.findOne({
            deliverableIds: deliverableId,
            creatorId: deliverable.creatorId,
        });

        if (existingPayment && existingPayment.status === 'Paid') {
            return next(errorHandler(400, 'Payment already processed'));
        }

        // Create or update payment
        if (existingPayment) {
            existingPayment.status = 'Triggered';
            existingPayment.triggeredAt = new Date();
            await existingPayment.save();
            res.status(200).json({ success: true, payment: existingPayment });
        } else {
            // Payment amount should be set manually by brand
            res.status(200).json({ 
                success: true, 
                message: 'Payment triggered. Please create payment entry with amount.',
                deliverableId: deliverable._id,
                creatorId: deliverable.creatorId,
            });
        }
    } catch (error) {
        next(error);
    }
};

export const updatePayment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const userId = req.user.id;

        const payment = await Payment.findById(id);
        if (!payment) {
            return next(errorHandler(404, 'Payment not found'));
        }

        const campaign = await Campaign.findById(payment.campaignId);
        const isOwner = campaign.brandId.toString() === userId;
        const isAdmin = campaign.teamMembers.some(
            m => m.userId.toString() === userId && ['Owner', 'Admin'].includes(m.role)
        );

        if (!isOwner && !isAdmin) {
            return next(errorHandler(403, 'Only owners and admins can update payments'));
        }

        if (updates.paymentDate) {
            updates.paymentDate = new Date(updates.paymentDate);
        }

        const updatedPayment = await Payment.findByIdAndUpdate(id, updates, { new: true })
            .populate('creatorId', 'username email profilePicture')
            .populate('deliverableIds');

        res.status(200).json({ success: true, payment: updatedPayment });
    } catch (error) {
        next(error);
    }
};

