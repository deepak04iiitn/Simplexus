import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signUpSuccess } from '../../redux/user/userSlice';
import { FileText, Calendar, CheckCircle2, Clock, Mail, UserPlus, ArrowRight, Sparkles, Building2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreatorPrivateDashboard() {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [acknowledging, setAcknowledging] = useState(false);
    const [accepting, setAccepting] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [signupData, setSignupData] = useState({
        username: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        fetchCampaignByInvitation();
    }, [token]);

    const fetchCampaignByInvitation = async () => {
        try {
            const res = await fetch(`/backend/campaigns/invite/${token}`);
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'Invalid or expired invitation');
                navigate('/');
                return;
            }

            setCampaign(data.campaign);
            setSignupData(prev => ({ ...prev, email: data.campaign.invitation.email }));
            
            // If user is not logged in, show signup form
            if (!currentUser) {
                setShowSignup(true);
            }
        } catch (error) {
            toast.error('Failed to load campaign');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        
        if (!signupData.username || !signupData.email || !signupData.password) {
            toast.error('All fields are required');
            return;
        }

        if (signupData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            const res = await fetch('/backend/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...signupData,
                    userType: 'Creator'
                })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'Signup failed');
                return;
            }

            dispatch(signUpSuccess(data));
            setShowSignup(false);
            
            toast.success('Account created successfully! Please accept the invitation below to start collaborating.');

            // Small delay to ensure state is updated
            setTimeout(async () => {
                // Refresh campaign data to show logged-in view
                await fetchCampaignByInvitation();
            }, 500);
        } catch (error) {
            toast.error('Failed to create account');
        }
    };

    const handleAcceptInvitation = async () => {
        if (!currentUser || !token) return;

        setAccepting(true);
        try {
            const res = await fetch(`/backend/campaigns/invite/${token}/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'Failed to accept invitation');
                return;
            }

            toast.success('Invitation accepted! You are now assigned to this campaign.');
            await fetchCampaignByInvitation();
        } catch (error) {
            toast.error('Failed to accept invitation');
        } finally {
            setAccepting(false);
        }
    };

    const handleAcknowledgeBrief = async () => {
        if (!currentUser || !campaign) return;

        setAcknowledging(true);
        try {
            const res = await fetch(`/backend/campaigns/${campaign._id}/acknowledge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'Failed to acknowledge brief');
                return;
            }

            toast.success('Brief acknowledged successfully!');
            await fetchCampaignByInvitation();
        } catch (error) {
            toast.error('Failed to acknowledge brief');
        } finally {
            setAcknowledging(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading campaign...</p>
                </div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Campaign not found</p>
                    <Link to="/" className="text-purple-600 hover:text-purple-700">
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    const creatorAssignment = campaign.assignedCreators?.find(
        c => c.creatorId?._id === currentUser?._id
    );

    const isAcknowledged = creatorAssignment?.acknowledgmentStatus === 'Acknowledged';

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-purple-100 rounded-xl">
                                    <Sparkles className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
                                    <p className="text-gray-600 mt-1">You've been invited to collaborate!</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-4">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    <span>Brand: {campaign.brandId?.username || campaign.brandId?.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(campaign.timeline.startDate).toLocaleDateString()} - {new Date(campaign.timeline.endDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            {!creatorAssignment && (
                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <strong>Next Step:</strong> Accept the invitation below to view the full campaign brief and start collaborating.
                                    </p>
                                </div>
                            )}
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                            campaign.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                            campaign.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {campaign.status}
                        </span>
                    </div>

                    {/* Signup Form - Show if not logged in */}
                    {showSignup && !currentUser && (
                        <div className="mt-6 p-6 bg-purple-50 border border-purple-200 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <UserPlus className="w-5 h-5 text-purple-600" />
                                <h3 className="text-lg font-semibold text-purple-900">Create Your Account</h3>
                            </div>
                            <p className="text-purple-700 mb-4 text-sm">
                                Create a free account to access this campaign and start collaborating.
                            </p>
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={signupData.username}
                                        onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={signupData.email}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={signupData.password}
                                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    Create Account & Continue
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Accept Invitation Section - Show if logged in but not assigned */}
                {currentUser && !creatorAssignment && (
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 p-8 mb-6">
                        <div className="text-center">
                            <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Mail className="w-8 h-8 text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Accept Invitation to Join Campaign</h2>
                            <p className="text-gray-600 mb-2">
                                You've been invited to collaborate on this campaign. Accept the invitation to be assigned and start working.
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                Once accepted, you'll be able to view the campaign brief and start collaborating.
                            </p>
                            <button
                                onClick={handleAcceptInvitation}
                                disabled={accepting}
                                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2 mx-auto disabled:opacity-50 shadow-lg"
                            >
                                {accepting ? (
                                    <>
                                        <Clock className="w-5 h-5 animate-spin" />
                                        Accepting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        Accept Invitation & Join Campaign
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Brief Section - Only show if assigned */}
                {campaign.briefId && creatorAssignment && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Campaign Brief</h2>
                        </div>
                        
                        <div className="prose max-w-none mb-6">
                            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Template</h3>
                                    <p className="text-gray-900">{campaign.briefId.template}</p>
                                </div>
                                {campaign.briefId.sections?.campaignObjective && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Campaign Objective</h3>
                                        <p className="text-gray-900">{campaign.briefId.sections.campaignObjective}</p>
                                    </div>
                                )}
                                {campaign.briefId.sections?.targetAudience && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Target Audience</h3>
                                        <p className="text-gray-900">{campaign.briefId.sections.targetAudience}</p>
                                    </div>
                                )}
                                {campaign.briefId.sections?.contentRequirements && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Content Requirements</h3>
                                        <p className="text-gray-900">{campaign.briefId.sections.contentRequirements}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Acknowledge Button */}
                        {currentUser && !isAcknowledged && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <button
                                    onClick={handleAcknowledgeBrief}
                                    disabled={acknowledging}
                                    className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {acknowledging ? (
                                        <>
                                            <Clock className="w-5 h-5 animate-spin" />
                                            Acknowledging...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            Acknowledge Brief
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {isAcknowledged && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="font-medium">Brief acknowledged on {new Date(creatorAssignment.acknowledgedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Cards */}
                {currentUser && isAcknowledged && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link
                            to={`/campaigns/${campaign._id}`}
                            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-purple-100 rounded-xl">
                                    <Eye className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">View Full Campaign</h3>
                                    <p className="text-sm text-gray-600">Access all campaign details and deliverables</p>
                                </div>
                            </div>
                        </Link>
                        <Link
                            to="/dashboard"
                            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-blue-100 rounded-xl">
                                    <Sparkles className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Go to Dashboard</h3>
                                    <p className="text-sm text-gray-600">View all your campaigns and activities</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Info for non-logged in users */}
                {!currentUser && !showSignup && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
                        <p className="text-gray-600 mb-4">Please create an account to access this campaign</p>
                        <button
                            onClick={() => setShowSignup(true)}
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                            Create Account
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

