import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, MessageSquare, Clock, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReviewDeliverable() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deliverable, setDeliverable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewData, setReviewData] = useState({
        comments: [],
        briefItemsStatus: [],
        decision: '',
        revisionNotes: '',
    });
    const [newComment, setNewComment] = useState({
        type: 'General',
        content: '',
        timestamp: '',
        isInternal: false,
    });

    useEffect(() => {
        fetchDeliverable();
    }, [id]);

    const fetchDeliverable = async () => {
        try {
            const res = await fetch(`/backend/deliverables/${id}`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setDeliverable(data.deliverable);
                // Load existing reviews
                fetchReviews();
            } else {
                toast.error(data.message || 'Failed to load deliverable');
            }
        } catch (error) {
            toast.error('Failed to load deliverable');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/backend/reviews/${id}`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok && data.reviews.length > 0) {
                const latestReview = data.reviews[0];
                setReviewData({
                    comments: latestReview.comments || [],
                    briefItemsStatus: latestReview.briefItemsStatus || [],
                    decision: latestReview.decision || '',
                    revisionNotes: latestReview.revisionNotes || '',
                });
            }
        } catch (error) {
            console.error('Failed to load reviews');
        }
    };

    const addComment = () => {
        if (!newComment.content.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        setReviewData(prev => ({
            ...prev,
            comments: [...prev.comments, {
                ...newComment,
                createdAt: new Date(),
            }],
        }));

        setNewComment({
            type: 'General',
            content: '',
            timestamp: '',
            isInternal: false,
        });
    };

    const submitReview = async () => {
        if (!reviewData.decision) {
            toast.error('Please select a decision');
            return;
        }

        if (reviewData.decision === 'Request Revision' && !reviewData.revisionNotes.trim()) {
            toast.error('Please provide revision notes');
            return;
        }

        try {
            const latestDraft = deliverable.drafts[deliverable.drafts.length - 1];
            const res = await fetch('/backend/reviews/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    deliverableId: id,
                    draftVersion: latestDraft.version,
                    comments: reviewData.comments,
                    briefItemsStatus: reviewData.briefItemsStatus,
                    decision: reviewData.decision,
                    revisionNotes: reviewData.revisionNotes,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Review submitted successfully!');
                navigate(`/campaigns/${deliverable.campaignId}`);
            } else {
                toast.error(data.message || 'Failed to submit review');
            }
        } catch (error) {
            toast.error('Failed to submit review');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!deliverable) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Deliverable not found</p>
                    <Link to="/dashboard" className="text-purple-600 hover:text-purple-700">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const latestDraft = deliverable.drafts[deliverable.drafts.length - 1];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    to={`/campaigns/${deliverable.campaignId}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Campaign
                </Link>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Review Deliverable - Version {latestDraft.version}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {deliverable.contentType} - {deliverable.platform} by {deliverable.creatorId?.username}
                            </p>
                        </div>
                    </div>

                    {/* Draft Links */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-medium text-gray-900 mb-2">Draft Links</h3>
                        <div className="space-y-2">
                            {latestDraft.videoLink && (
                                <a href={latestDraft.videoLink} target="_blank" rel="noopener noreferrer" className="block text-purple-600 hover:underline">
                                    Video Link
                                </a>
                            )}
                            {latestDraft.driveLink && (
                                <a href={latestDraft.driveLink} target="_blank" rel="noopener noreferrer" className="block text-purple-600 hover:underline">
                                    Google Drive Link
                                </a>
                            )}
                            {latestDraft.dropboxLink && (
                                <a href={latestDraft.dropboxLink} target="_blank" rel="noopener noreferrer" className="block text-purple-600 hover:underline">
                                    Dropbox Link
                                </a>
                            )}
                            {latestDraft.notes && (
                                <p className="text-gray-600 mt-2">{latestDraft.notes}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Comments</h2>
                    
                    {/* Add Comment Form */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comment Type
                                </label>
                                <select
                                    value={newComment.type}
                                    onChange={(e) => setNewComment(prev => ({ ...prev, type: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="General">General</option>
                                    <option value="Timestamp">Timestamp (for video)</option>
                                    <option value="Brief Check">Brief Check</option>
                                    <option value="Legal">Legal/Compliance</option>
                                </select>
                            </div>
                            {newComment.type === 'Timestamp' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Timestamp (e.g., 0:14)
                                    </label>
                                    <input
                                        type="text"
                                        value={newComment.timestamp}
                                        onChange={(e) => setNewComment(prev => ({ ...prev, timestamp: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="0:14"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comment
                                </label>
                                <textarea
                                    value={newComment.content}
                                    onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Add your comment..."
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="internal"
                                    checked={newComment.isInternal}
                                    onChange={(e) => setNewComment(prev => ({ ...prev, isInternal: e.target.checked }))}
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <label htmlFor="internal" className="text-sm text-gray-700">
                                    Internal note (not visible to creator)
                                </label>
                            </div>
                            <button
                                onClick={addComment}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Add Comment
                            </button>
                        </div>
                    </div>

                    {/* Existing Comments */}
                    <div className="space-y-4">
                        {reviewData.comments.map((comment, index) => (
                            <div key={index} className={`p-4 rounded-lg border ${
                                comment.isInternal ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'
                            }`}>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 rounded">
                                            {comment.type}
                                        </span>
                                        {comment.isInternal && (
                                            <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                                                Internal
                                            </span>
                                        )}
                                        {comment.timestamp && (
                                            <span className="text-xs text-gray-500">
                                                <Clock className="w-3 h-3 inline mr-1" />
                                                {comment.timestamp}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-900">{comment.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decision Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Decision</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => setReviewData(prev => ({ ...prev, decision: 'Approve' }))}
                                className={`p-4 rounded-lg border-2 transition-colors ${
                                    reviewData.decision === 'Approve'
                                        ? 'border-green-600 bg-green-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <CheckCircle2 className={`w-8 h-8 mx-auto mb-2 ${
                                    reviewData.decision === 'Approve' ? 'text-green-600' : 'text-gray-400'
                                }`} />
                                <p className="font-medium text-gray-900">Approve</p>
                            </button>
                            <button
                                onClick={() => setReviewData(prev => ({ ...prev, decision: 'Request Revision' }))}
                                className={`p-4 rounded-lg border-2 transition-colors ${
                                    reviewData.decision === 'Request Revision'
                                        ? 'border-yellow-600 bg-yellow-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <MessageSquare className={`w-8 h-8 mx-auto mb-2 ${
                                    reviewData.decision === 'Request Revision' ? 'text-yellow-600' : 'text-gray-400'
                                }`} />
                                <p className="font-medium text-gray-900">Request Revision</p>
                            </button>
                            <button
                                onClick={() => setReviewData(prev => ({ ...prev, decision: 'Reject' }))}
                                className={`p-4 rounded-lg border-2 transition-colors ${
                                    reviewData.decision === 'Reject'
                                        ? 'border-red-600 bg-red-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <XCircle className={`w-8 h-8 mx-auto mb-2 ${
                                    reviewData.decision === 'Reject' ? 'text-red-600' : 'text-gray-400'
                                }`} />
                                <p className="font-medium text-gray-900">Reject</p>
                            </button>
                        </div>

                        {reviewData.decision === 'Request Revision' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Revision Notes *
                                </label>
                                <textarea
                                    value={reviewData.revisionNotes}
                                    onChange={(e) => setReviewData(prev => ({ ...prev, revisionNotes: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    rows="4"
                                    placeholder="Please specify what needs to be changed..."
                                    required
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        onClick={submitReview}
                        className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        Submit Review
                    </button>
                    <Link
                        to={`/campaigns/${deliverable.campaignId}`}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    );
}

