import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Plus, DollarSign, CheckCircle2, Clock, XCircle, Eye, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentManagement() {
    const { campaignId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const { deliverables } = useSelector((state) => state.deliverable);

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedDeliverables, setSelectedDeliverables] = useState([]);
    const [paymentForm, setPaymentForm] = useState({
        creatorId: '',
        deliverableIds: [],
        amount: '',
        currency: 'USD',
        paymentMethod: 'Other',
        transactionId: '',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: '',
    });

    useEffect(() => {
        if (campaignId) {
            fetchPayments();
            fetchDeliverables();
        }
    }, [campaignId]);

    const fetchPayments = async () => {
        try {
            const res = await fetch(`/backend/payments/campaign/${campaignId}`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setPayments(data.payments || []);
            }
        } catch (error) {
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    const fetchDeliverables = async () => {
        try {
            const res = await fetch(`/backend/deliverables/campaign/${campaignId}`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                // Filter only completed deliverables
                const completed = (data.deliverables || []).filter(d => d.status === 'Completed');
                setSelectedDeliverables(completed);
            }
        } catch (error) {
            console.error('Failed to load deliverables');
        }
    };

    const handleCreatePayment = async (e) => {
        e.preventDefault();

        if (!paymentForm.creatorId || paymentForm.deliverableIds.length === 0 || !paymentForm.amount) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const res = await fetch('/backend/payments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    campaignId,
                    ...paymentForm,
                    amount: parseFloat(paymentForm.amount),
                    deliverableIds: paymentForm.deliverableIds,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Payment created successfully!');
                setShowCreateModal(false);
                setPaymentForm({
                    creatorId: '',
                    deliverableIds: [],
                    amount: '',
                    currency: 'USD',
                    paymentMethod: 'Other',
                    transactionId: '',
                    paymentDate: new Date().toISOString().split('T')[0],
                    notes: '',
                });
                fetchPayments();
            } else {
                toast.error(data.message || 'Failed to create payment');
            }
        } catch (error) {
            toast.error('Failed to create payment');
        }
    };

    const handleTriggerPayment = async (deliverableId) => {
        try {
            const res = await fetch(`/backend/payments/trigger/${deliverableId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Payment triggered successfully!');
                fetchPayments();
            } else {
                toast.error(data.message || 'Failed to trigger payment');
            }
        } catch (error) {
            toast.error('Failed to trigger payment');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Triggered': return 'bg-blue-100 text-blue-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Paid': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'Triggered': return <Clock className="w-5 h-5 text-blue-600" />;
            case 'Pending': return <Clock className="w-5 h-5 text-yellow-600" />;
            default: return <XCircle className="w-5 h-5 text-gray-600" />;
        }
    };

    // Group deliverables by creator
    const deliverablesByCreator = selectedDeliverables.reduce((acc, deliverable) => {
        const creatorId = deliverable.creatorId._id;
        if (!acc[creatorId]) {
            acc[creatorId] = {
                creator: deliverable.creatorId,
                deliverables: [],
            };
        }
        acc[creatorId].deliverables.push(deliverable);
        return acc;
    }, {});

    const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
    const totalPending = payments.filter(p => p.status === 'Pending' || p.status === 'Triggered').reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    to={`/campaigns/${campaignId}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Campaign
                </Link>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
                        <p className="text-gray-600 mt-1">Manage payments for campaign deliverables</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Payment
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Payments</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{payments.length}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Paid</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">${totalPaid.toFixed(2)}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600 mt-1">${totalPending.toFixed(2)}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payments List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading payments...</div>
                    ) : payments.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 mb-4">No payments yet</p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="text-purple-600 hover:text-purple-700"
                            >
                                Create your first payment
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {payments.map((payment) => (
                                <div key={payment._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {payment.creatorId?.username}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                                    {payment.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>
                                                    <span className="font-medium">Amount:</span> {payment.currency} ${payment.amount.toFixed(2)}
                                                </p>
                                                {payment.deliverableIds?.length > 0 && (
                                                    <p>
                                                        <span className="font-medium">Deliverables:</span> {payment.deliverableIds.length}
                                                    </p>
                                                )}
                                                {payment.transactionId && (
                                                    <p>
                                                        <span className="font-medium">Transaction ID:</span> {payment.transactionId}
                                                    </p>
                                                )}
                                                {payment.paymentDate && (
                                                    <p>
                                                        <span className="font-medium">Payment Date:</span> {new Date(payment.paymentDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                                {payment.notes && (
                                                    <p className="mt-2 text-gray-500">{payment.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(payment.status)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Payment Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">Create Payment</h2>
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={handleCreatePayment} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Creator *
                                    </label>
                                    <select
                                        value={paymentForm.creatorId}
                                        onChange={(e) => {
                                            setPaymentForm(prev => ({ ...prev, creatorId: e.target.value }));
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select Creator</option>
                                        {Object.values(deliverablesByCreator).map((group) => (
                                            <option key={group.creator._id} value={group.creator._id}>
                                                {group.creator.username} ({group.deliverables.length} deliverables)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Deliverables *
                                    </label>
                                    <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                                        {paymentForm.creatorId ? (
                                            deliverablesByCreator[paymentForm.creatorId]?.deliverables.map((deliverable) => (
                                                <label key={deliverable._id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={paymentForm.deliverableIds.includes(deliverable._id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setPaymentForm(prev => ({
                                                                    ...prev,
                                                                    deliverableIds: [...prev.deliverableIds, deliverable._id],
                                                                }));
                                                            } else {
                                                                setPaymentForm(prev => ({
                                                                    ...prev,
                                                                    deliverableIds: prev.deliverableIds.filter(id => id !== deliverable._id),
                                                                }));
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {deliverable.contentType} - {deliverable.platform}
                                                    </span>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">Please select a creator first</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Amount *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={paymentForm.amount}
                                            onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Currency
                                        </label>
                                        <select
                                            value={paymentForm.currency}
                                            onChange={(e) => setPaymentForm(prev => ({ ...prev, currency: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                            <option value="INR">INR</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Payment Method
                                        </label>
                                        <select
                                            value={paymentForm.paymentMethod}
                                            onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="Bank Transfer">Bank Transfer</option>
                                            <option value="PayPal">PayPal</option>
                                            <option value="Stripe">Stripe</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Payment Date
                                        </label>
                                        <input
                                            type="date"
                                            value={paymentForm.paymentDate}
                                            onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Transaction ID (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentForm.transactionId}
                                        onChange={(e) => setPaymentForm(prev => ({ ...prev, transactionId: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Enter transaction ID"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={paymentForm.notes}
                                        onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        rows="3"
                                        placeholder="Additional notes about this payment"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Create Payment
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

