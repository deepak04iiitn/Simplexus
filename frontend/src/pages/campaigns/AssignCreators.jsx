import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { assignCreators, getCampaign } from '../../redux/campaign/campaignSlice';
import { ArrowLeft, Search, UserPlus, CheckCircle2, Clock, X, User, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AssignCreators() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentCampaign } = useSelector((state) => state.campaign);
    const { currentUser } = useSelector((state) => state.user);

    const [availableCreators, setAvailableCreators] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCreators, setSelectedCreators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [externalEmail, setExternalEmail] = useState('');
    const [invitingExternal, setInvitingExternal] = useState(false);

    useEffect(() => {
        fetchCampaign();
        fetchAvailableCreators();
    }, [id]);

    const fetchCampaign = async () => {
        try {
            await dispatch(getCampaign(id)).unwrap();
        } catch (error) {
            toast.error('Failed to load campaign');
        }
    };

    const fetchAvailableCreators = async () => {
        setLoading(true);
        try {
            const res = await fetch('/backend/creator-profiles/search/creators', {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                // Filter out already assigned creators
                const assignedIds = currentCampaign?.assignedCreators?.map(c => c.creatorId._id) || [];
                const available = (data.profiles || []).filter(
                    p => !assignedIds.includes(p.userId._id)
                );
                setAvailableCreators(available);
            }
        } catch (error) {
            toast.error('Failed to load creators');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (searchQuery) {
                // Search by username, email, or niche
                queryParams.append('niche', searchQuery);
            }

            const res = await fetch(`/backend/creator-profiles/search/creators?${queryParams}`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                const assignedIds = currentCampaign?.assignedCreators?.map(c => c.creatorId._id) || [];
                const available = (data.profiles || []).filter(
                    p => !assignedIds.includes(p.userId._id)
                );
                setAvailableCreators(available);
            }
        } catch (error) {
            toast.error('Failed to search creators');
        } finally {
            setLoading(false);
        }
    };

    const toggleCreatorSelection = (creatorId) => {
        setSelectedCreators(prev => {
            if (prev.includes(creatorId)) {
                return prev.filter(id => id !== creatorId);
            } else {
                return [...prev, creatorId];
            }
        });
    };

    const handleAssign = async () => {
        if (selectedCreators.length === 0) {
            toast.error('Please select at least one creator');
            return;
        }

        setAssigning(true);
        try {
            const result = await dispatch(assignCreators({ id, creatorIds: selectedCreators })).unwrap();
            toast.success(
                result.message || `Invitation emails sent to ${selectedCreators.length} creator(s)! They must accept the invitation to be assigned.`,
                { duration: 6000 }
            );
            // Small delay to show the success message before navigating
            setTimeout(() => {
                navigate(`/campaigns/${id}`);
            }, 1500);
        } catch (error) {
            toast.error(error || 'Failed to assign creators');
        } finally {
            setAssigning(false);
        }
    };

    const handleInviteExternal = async () => {
        if (!externalEmail || externalEmail.trim() === '') {
            toast.error('Please enter an email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(externalEmail)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setInvitingExternal(true);
        try {
            const res = await fetch(`/backend/campaigns/${id}/invite-external`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email: externalEmail }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'Failed to send invitation');
                return;
            }

            if (data.isExistingUser) {
                toast.success('Creator assigned and invitation email sent!');
            } else {
                toast.success('Invitation email sent successfully!');
            }
            
            setExternalEmail('');
            // Refresh campaign data to show newly assigned creator if it was an existing user
            if (data.isExistingUser) {
                await fetchCampaign();
            }
        } catch (error) {
            toast.error('Failed to send invitation');
        } finally {
            setInvitingExternal(false);
        }
    };

    if (!currentCampaign) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    const assignedCreators = currentCampaign.assignedCreators || [];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    to={`/campaigns/${id}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Campaign
                </Link>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Assign Creators</h1>
                    <p className="text-gray-600">{currentCampaign.name}</p>
                </div>

                {/* Currently Assigned Creators */}
                {assignedCreators.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Currently Assigned Creators</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {assignedCreators.map((assignment) => (
                                <div key={assignment.creatorId._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <img
                                            src={assignment.creatorId.profilePicture}
                                            alt={assignment.creatorId.username}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{assignment.creatorId.username}</p>
                                            <p className="text-sm text-gray-500">{assignment.creatorId.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded ${
                                                assignment.acknowledgmentStatus === 'Acknowledged'
                                                    ? 'bg-green-100 text-green-800'
                                                    : assignment.acknowledgmentStatus === 'Declined'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {assignment.acknowledgmentStatus}
                                            </span>
                                            {assignment.acknowledgmentStatus === 'Pending' && (
                                                <div className="flex items-center gap-1 text-xs text-gray-500" title="Invitation email sent">
                                                    <Mail className="w-3 h-3" />
                                                    <span>Invited</span>
                                                </div>
                                            )}
                                        </div>
                                        {assignment.acknowledgedAt && (
                                            <span className="text-xs text-gray-500">
                                                {new Date(assignment.acknowledgedAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search and Select Creators */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Creators to Campaign</h2>
                    
                    {/* Search Bar */}
                    <div className="flex gap-3 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Search by niche, username, or email..."
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Search
                        </button>
                        <button
                            onClick={fetchAvailableCreators}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Show All
                        </button>
                    </div>

                    {/* Selected Count */}
                    {selectedCreators.length > 0 && (
                        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-purple-700 font-medium">
                                    {selectedCreators.length} creator(s) selected
                                </span>
                                <button
                                    onClick={() => setSelectedCreators([])}
                                    className="text-purple-600 hover:text-purple-700 text-sm"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Creators List */}
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Loading creators...</div>
                    ) : availableCreators.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-2">No creators found</p>
                            <p className="text-sm text-gray-400">Try adjusting your search or check back later</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {availableCreators.map((profile) => {
                                const isSelected = selectedCreators.includes(profile.userId._id);
                                return (
                                    <div
                                        key={profile._id}
                                        onClick={() => toggleCreatorSelection(profile.userId._id)}
                                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                            isSelected
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={profile.userId.profilePicture}
                                                    alt={profile.userId.username}
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900">{profile.userId.username}</p>
                                                    <p className="text-sm text-gray-500">{profile.userId.email}</p>
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <div className="bg-purple-600 rounded-full p-1">
                                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        {profile.niche && profile.niche.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {profile.niche.slice(0, 3).map((n, i) => (
                                                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                        {n}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {profile.platforms && profile.platforms.length > 0 && (
                                            <div className="space-y-1 mb-3">
                                                {profile.platforms.slice(0, 2).map((platform, i) => (
                                                    <div key={i} className="flex items-center justify-between text-xs text-gray-600">
                                                        <span>{platform.platform}</span>
                                                        {platform.followers && (
                                                            <span>{platform.followers.toLocaleString()} followers</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {profile.stats && (
                                            <div className="pt-3 border-t border-gray-200">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-600">On-Time Rate</span>
                                                    <span className="font-semibold text-green-600">
                                                        {profile.stats.onTimeRate?.toFixed(0) || 0}%
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Assign Button */}
                    {selectedCreators.length > 0 && (
                        <div className="flex gap-4 pt-4 border-t border-gray-200">
                            <button
                                onClick={handleAssign}
                                disabled={assigning}
                                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {assigning ? (
                                    <>
                                        <Clock className="w-5 h-5 animate-spin" />
                                        Assigning...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5" />
                                        Assign & Send Invitations ({selectedCreators.length})
                                    </>
                                )}
                            </button>
                            <Link
                                to={`/campaigns/${id}`}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    )}
                </div>

                {/* Invite External Creator */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Invite External Creator</h2>
                    <p className="text-gray-600 mb-4">
                        Invite a creator who doesn't have a Simplexus account yet. They'll receive an email invitation to sign up and will be automatically assigned to this campaign.
                    </p>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <input
                                type="email"
                                value={externalEmail}
                                onChange={(e) => setExternalEmail(e.target.value)}
                                placeholder="creator@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                disabled={invitingExternal}
                            />
                        </div>
                        <button
                            onClick={handleInviteExternal}
                            disabled={invitingExternal || !externalEmail}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {invitingExternal ? (
                                <>
                                    <Clock className="w-5 h-5 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Mail className="w-5 h-5" />
                                    Send Invitation
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Email Invitation Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-semibold text-blue-900 mb-1">Automatic Email Invitations</h3>
                            <p className="text-sm text-blue-700">
                                When you assign existing creators to this campaign, they will automatically receive an invitation email with campaign details and a link to view the brief. The email will be sent to their registered email address.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

