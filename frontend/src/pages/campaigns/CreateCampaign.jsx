import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCampaign } from '../../redux/campaign/campaignSlice';
import { ArrowLeft, Calendar, Users, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn', 'Facebook', 'Other'];

export default function CreateCampaign() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.campaign);
    const { currentUser } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        name: '',
        platforms: [],
        numberOfCreators: '',
        timeline: {
            startDate: '',
            endDate: '',
        },
    });

    const handlePlatformToggle = (platform) => {
        setFormData(prev => ({
            ...prev,
            platforms: prev.platforms.includes(platform)
                ? prev.platforms.filter(p => p !== platform)
                : [...prev.platforms, platform],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || formData.platforms.length === 0 || !formData.numberOfCreators || !formData.timeline.startDate || !formData.timeline.endDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const result = await dispatch(createCampaign({
                ...formData,
                numberOfCreators: parseInt(formData.numberOfCreators),
            })).unwrap();
            
            toast.success('Campaign created successfully!');
            navigate(`/campaigns/${result.campaign._id}`);
        } catch (error) {
            toast.error(error || 'Failed to create campaign');
        }
    };

    if (!currentUser || (currentUser.userType !== 'Brand' && currentUser.userType !== 'Agency')) {
        navigate('/dashboard');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Campaign</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Campaign Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Campaign Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., Summer Product Launch 2024"
                                required
                            />
                        </div>

                        {/* Platforms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Platforms *
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {PLATFORMS.map((platform) => (
                                    <button
                                        key={platform}
                                        type="button"
                                        onClick={() => handlePlatformToggle(platform)}
                                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                                            formData.platforms.includes(platform)
                                                ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                        }`}
                                    >
                                        {platform}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Number of Creators */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Creators *
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.numberOfCreators}
                                onChange={(e) => setFormData(prev => ({ ...prev, numberOfCreators: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 10"
                                required
                            />
                        </div>

                        {/* Timeline */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.timeline.startDate}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        timeline: { ...prev.timeline, startDate: e.target.value },
                                    }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.timeline.endDate}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        timeline: { ...prev.timeline, endDate: e.target.value },
                                    }))}
                                    min={formData.timeline.startDate}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating...' : 'Create Campaign'}
                            </button>
                            <Link
                                to="/dashboard"
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

