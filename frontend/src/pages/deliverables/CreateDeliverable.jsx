import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createDeliverable } from '../../redux/deliverable/deliverableSlice';
import { getCampaign } from '../../redux/campaign/campaignSlice';
import { ArrowLeft, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateDeliverable() {
    const { id: campaignId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentCampaign } = useSelector((state) => state.campaign);
    const { currentUser } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        creatorId: '',
        platform: '',
        contentType: '',
        dueDate: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (campaignId) {
            dispatch(getCampaign(campaignId));
        }
    }, [campaignId, dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.creatorId || !formData.platform || !formData.contentType || !formData.dueDate) {
            toast.error('Please fill in all fields');
            return;
        }

        setSubmitting(true);
        try {
            await dispatch(createDeliverable({
                campaignId,
                ...formData,
            })).unwrap();
            toast.success('Deliverable created successfully!');
            navigate(`/campaigns/${campaignId}`);
        } catch (error) {
            toast.error(error || 'Failed to create deliverable');
        } finally {
            setSubmitting(false);
        }
    };

    const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn', 'Facebook', 'Other'];
    const contentTypes = ['Reel', 'Post', 'Story', 'Video', 'Tutorial', 'Review', 'Unboxing', 'Other'];

    const assignedCreators = currentCampaign?.assignedCreators || [];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    to={`/campaigns/${campaignId}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Campaign
                </Link>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Deliverable</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Creator Selection */}
                        <div>
                            <label htmlFor="creatorId" className="block text-sm font-medium text-gray-700 mb-2">
                                Creator <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="creatorId"
                                name="creatorId"
                                value={formData.creatorId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select a creator</option>
                                {assignedCreators.map((assignment) => {
                                    const creator = assignment.creatorId;
                                    return (
                                        <option key={creator._id} value={creator._id}>
                                            {creator.username} ({creator.email})
                                        </option>
                                    );
                                })}
                            </select>
                            {assignedCreators.length === 0 && (
                                <p className="mt-2 text-sm text-yellow-600">
                                    No creators assigned to this campaign. Please assign creators first.
                                </p>
                            )}
                        </div>

                        {/* Platform Selection */}
                        <div>
                            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
                                Platform <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="platform"
                                name="platform"
                                value={formData.platform}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select platform</option>
                                {platforms.map((platform) => (
                                    <option key={platform} value={platform}>
                                        {platform}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Content Type Selection */}
                        <div>
                            <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-2">
                                Content Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="contentType"
                                name="contentType"
                                value={formData.contentType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select content type</option>
                                {contentTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                                Due Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Link
                                to={`/campaigns/${campaignId}`}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={submitting || assignedCreators.length === 0}
                                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                {submitting ? 'Creating...' : 'Create Deliverable'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

