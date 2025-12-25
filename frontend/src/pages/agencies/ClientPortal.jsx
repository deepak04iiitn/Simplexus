import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, Globe, FileText, Users, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClientPortal() {
    const { campaignId } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [deliverables, setDeliverables] = useState([]);
    const [brief, setBrief] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('client'); // 'client' or 'agency'

    useEffect(() => {
        fetchCampaignData();
    }, [campaignId]);

    const fetchCampaignData = async () => {
        try {
            const [campaignRes, deliverablesRes, briefRes] = await Promise.all([
                fetch(`/backend/campaigns/${campaignId}`, { credentials: 'include' }),
                fetch(`/backend/deliverables/campaign/${campaignId}`, { credentials: 'include' }),
                fetch(`/backend/briefs/${campaignId}`, { credentials: 'include' }),
            ]);

            const campaignData = await campaignRes.json();
            const deliverablesData = await deliverablesRes.json();
            const briefData = await briefRes.json();

            if (campaignRes.ok) {
                setCampaign(campaignData.campaign);
            }
            if (deliverablesRes.ok) {
                setDeliverables(deliverablesData.deliverables || []);
            }
            if (briefRes.ok) {
                setBrief(briefData.brief);
            }
        } catch (error) {
            toast.error('Failed to load campaign data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Approved': return 'bg-blue-100 text-blue-800';
            case 'In Review': return 'bg-yellow-100 text-yellow-800';
            case 'Posted': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Campaign not found</p>
                    <Link to="/dashboard" className="text-purple-600 hover:text-purple-700">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const stats = {
        total: deliverables.length,
        completed: deliverables.filter(d => d.status === 'Completed').length,
        approved: deliverables.filter(d => d.status === 'Approved' || d.status === 'Completed').length,
        inReview: deliverables.filter(d => d.status === 'In Review').length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('client')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                viewMode === 'client'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <Eye className="w-4 h-4 inline mr-1" />
                            Client View
                        </button>
                        <button
                            onClick={() => setViewMode('agency')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                viewMode === 'agency'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <EyeOff className="w-4 h-4 inline mr-1" />
                            Agency View
                        </button>
                    </div>
                </div>

                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(campaign.timeline.startDate).toLocaleDateString()} - {new Date(campaign.timeline.endDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    campaign.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                                    campaign.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {campaign.status}
                                </span>
                            </div>
                        </div>
                        {viewMode === 'agency' && (
                            <Link
                                to={`/campaigns/${campaignId}`}
                                className="text-purple-600 hover:text-purple-700 text-sm"
                            >
                                Full Management →
                            </Link>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Deliverables</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                            </div>
                            <FileText className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
                            </div>
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Approved</p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.approved}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">In Review</p>
                                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.inReview}</p>
                            </div>
                            <Calendar className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                </div>

                {/* Brief Summary (Client View Only) */}
                {viewMode === 'client' && brief && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Brief</h2>
                        <div className="space-y-3">
                            {brief.sections?.campaignObjective && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Objective</p>
                                    <p className="text-gray-600">{brief.sections.campaignObjective}</p>
                                </div>
                            )}
                            {brief.sections?.keyMessaging && brief.sections.keyMessaging.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Key Messaging</p>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        {brief.sections.keyMessaging.map((msg, index) => (
                                            <li key={index}>{msg.message}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {brief.sections?.hashtags && brief.sections.hashtags.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Hashtags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {brief.sections.hashtags.map((tag, index) => (
                                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Creators (Agency View Only) */}
                {viewMode === 'agency' && campaign.assignedCreators && campaign.assignedCreators.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Assigned Creators</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {campaign.assignedCreators.map((assignment) => (
                                <div key={assignment.creatorId._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={assignment.creatorId.profilePicture}
                                            alt={assignment.creatorId.username}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">{assignment.creatorId.username}</p>
                                            <p className="text-sm text-gray-500">{assignment.creatorId.email}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            assignment.acknowledgmentStatus === 'Acknowledged'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {assignment.acknowledgmentStatus}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Deliverables */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Deliverables</h2>
                        {viewMode === 'agency' && (
                            <Link
                                to={`/campaigns/${campaignId}`}
                                className="text-purple-600 hover:text-purple-700 text-sm"
                            >
                                Manage All →
                            </Link>
                        )}
                    </div>
                    {deliverables.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No deliverables yet</p>
                    ) : (
                        <div className="space-y-4">
                            {deliverables.map((deliverable) => (
                                <div key={deliverable._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-medium text-gray-900">
                                                    {deliverable.contentType} - {deliverable.platform}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(deliverable.status)}`}>
                                                    {deliverable.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>Creator: {deliverable.creatorId?.username}</p>
                                                {deliverable.postingDetails?.postUrl && (
                                                    <p>
                                                        <a
                                                            href={deliverable.postingDetails.postUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-purple-600 hover:underline"
                                                        >
                                                            View Post →
                                                        </a>
                                                    </p>
                                                )}
                                                {deliverable.performance && (
                                                    <div className="mt-2 flex gap-4 text-xs">
                                                        {deliverable.performance.views && (
                                                            <span>Views: {deliverable.performance.views.toLocaleString()}</span>
                                                        )}
                                                        {deliverable.performance.likes && (
                                                            <span>Likes: {deliverable.performance.likes.toLocaleString()}</span>
                                                        )}
                                                        {deliverable.performance.engagementRate && (
                                                            <span>Engagement: {deliverable.performance.engagementRate}%</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {viewMode === 'agency' && (
                                            <Link
                                                to={`/deliverables/${deliverable._id}`}
                                                className="ml-4 text-purple-600 hover:text-purple-700"
                                            >
                                                View Details →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Agency-Only Actions */}
                {viewMode === 'agency' && (
                    <div className="mt-6 flex gap-4">
                        <Link
                            to={`/campaigns/${campaignId}/payments`}
                            className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors text-center"
                        >
                            View Payments
                        </Link>
                        <Link
                            to={`/campaigns/${campaignId}/reports`}
                            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center"
                        >
                            Generate Report
                        </Link>
                        <Link
                            to={`/campaigns/${campaignId}/team`}
                            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
                        >
                            Team Collaboration
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

