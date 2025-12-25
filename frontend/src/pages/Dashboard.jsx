import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getCampaigns } from '../redux/campaign/campaignSlice';
import { Plus, Calendar, Users, TrendingUp, Clock, CheckCircle2, XCircle, FileText, DollarSign, BarChart3, UserCircle, Users2, Building2, Search, UserPlus } from 'lucide-react';

export default function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { campaigns, loading } = useSelector((state) => state.campaign);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getCampaigns());
    }, [dispatch]);

    const stats = {
        total: campaigns.length,
        active: campaigns.filter(c => c.status === 'Active').length,
        completed: campaigns.filter(c => c.status === 'Completed').length,
        pending: campaigns.filter(c => c.status === 'Draft' || c.status === 'In Review').length,
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Draft': return 'bg-gray-100 text-gray-800';
            case 'In Review': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (!currentUser) {
        navigate('/sign-in');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-1">Welcome back, {currentUser.username}</p>
                    </div>
                    {(currentUser.userType === 'Brand' || currentUser.userType === 'Agency') && (
                        <Link
                            to="/campaigns/create"
                            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Create Campaign
                        </Link>
                    )}
                </div>

                {/* Quick Actions */}
                {(currentUser.userType === 'Brand' || currentUser.userType === 'Agency') && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            <Link
                                to="/campaigns/create"
                                className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                            >
                                <Plus className="w-6 h-6 text-gray-400 group-hover:text-purple-600 mb-2" />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">Create Campaign</span>
                            </Link>
                            <Link
                                to="/creator-profiles/search/creators"
                                className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            >
                                <Search className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mb-2" />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 text-center">Find Creators</span>
                            </Link>
                            <div className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
                                <UserPlus className="w-6 h-6 text-gray-400 mb-2" />
                                <span className="text-sm font-medium text-gray-700 text-center">Assign Creators</span>
                                <span className="text-xs text-gray-500 mt-1">(From Campaign)</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
                                <FileText className="w-6 h-6 text-gray-400 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Reports</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
                                <DollarSign className="w-6 h-6 text-gray-400 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Payments</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
                                <Users2 className="w-6 h-6 text-gray-400 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Team</span>
                            </div>
                            {currentUser.userType === 'Agency' && (
                                <div className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
                                    <Building2 className="w-6 h-6 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium text-gray-700">Client Portal</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {currentUser.userType === 'Creator' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Link
                                to={`/creators/${currentUser._id}`}
                                className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                            >
                                <UserCircle className="w-6 h-6 text-gray-400 group-hover:text-purple-600 mb-2" />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">My Profile</span>
                            </Link>
                            <Link
                                to={`/creators/${currentUser._id}`}
                                className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            >
                                <FileText className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mb-2" />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">View Resume</span>
                            </Link>
                            <div className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
                                <BarChart3 className="w-6 h-6 text-gray-400 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Analytics</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Campaigns</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completed}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <XCircle className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Campaigns List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Campaigns</h2>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading campaigns...</div>
                    ) : campaigns.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 mb-4">No campaigns yet</p>
                            {(currentUser.userType === 'Brand' || currentUser.userType === 'Agency') && (
                                <Link
                                    to="/campaigns/create"
                                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create your first campaign
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {campaigns.map((campaign) => (
                                <Link
                                    key={campaign._id}
                                    to={`/campaigns/${campaign._id}`}
                                    className="block p-6 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {campaign.name}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                                    {campaign.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {new Date(campaign.timeline.startDate).toLocaleDateString()} - {new Date(campaign.timeline.endDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>{campaign.assignedCreators.length} creators</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span>{campaign.platforms.join(', ')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

