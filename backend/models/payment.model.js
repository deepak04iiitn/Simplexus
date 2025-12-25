import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true,
    },
    deliverableIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deliverable',
    }],
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'USD',
    },
    status: {
        type: String,
        enum: ['Pending', 'Triggered', 'Paid'],
        default: 'Pending',
    },
    paymentMethod: {
        type: String,
        enum: ['Bank Transfer', 'PayPal', 'Stripe', 'Other'],
        default: 'Other',
    },
    transactionId: String,
    paymentDate: Date,
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    notes: String,
    triggeredAt: Date, // When post was verified and payment was triggered
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;

