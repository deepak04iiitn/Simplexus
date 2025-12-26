import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCampaign } from '../../redux/campaign/campaignSlice';
import { getBrief } from '../../redux/brief/briefSlice';
import { getDeliverables } from '../../redux/deliverable/deliverableSlice';
import { FileText, Users, Calendar, Plus, CheckCircle2, Clock, XCircle, ArrowLeft, Eye, DollarSign, BarChart3, Users2, Building2, UserPlus, Mail, X, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CampaignDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentCampaign, loading } = useSelector((state) => state.campaign);
    const { currentBrief } = useSelector((state) => state.brief);
    const { deliverables } = useSelector((state) => state.deliverable);
    const { currentUser } = useSelector((state) => state.user);

    const [removingCreator, setRemovingCreator] = useState(null);

    useEffect(() => {
        if (id) {
            dispatch(getCampaign(id));
            dispatch(getBrief(id));
            dispatch(getDeliverables(id));
        }
    }, [id, dispatch]);

    const isBrandOrAgency = currentUser?.userType === 'Brand' || currentUser?.userType === 'Agency';
    const isCreator = currentUser?.userType === 'Creator';

    const handleRemoveCreator = async (creatorId) => {
        if (!window.confirm('Are you sure you want to remove this creator from the campaign?')) {
            return;
        }

        setRemovingCreator(creatorId);
        try {
            const res = await fetch(`/backend/campaigns/${id}/remove-creator`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ creatorId }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'Failed to remove creator');
                return;
            }

            toast.success('Creator removed successfully');
            dispatch(getCampaign(id)); // Refresh campaign data
        } catch (error) {
            toast.error('Failed to remove creator');
        } finally {
            setRemovingCreator(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Loading campaign...</div>
            </div>
        );
    }

    if (!currentCampaign) {
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

    const creatorAssignment = currentCampaign.assignedCreators?.find(
        c => c.creatorId._id === currentUser?._id
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </Link>

                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentCampaign.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    currentCampaign.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                                    currentCampaign.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {currentCampaign.status}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(currentCampaign.timeline.startDate).toLocaleDateString()} - {new Date(currentCampaign.timeline.endDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {isBrandOrAgency && (
                            <div className="flex gap-2">
                                <Link
                                    to={`/campaigns/${id}/brief`}
                                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <FileText className="w-5 h-5" />
                                    {currentBrief ? 'Edit Brief' : 'Create Brief'}
                                </Link>
                                {currentUser.userType === 'Agency' && (
                                    <Link
                                        to={`/campaigns/${id}/portal`}
                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Client Portal
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Creator Acknowledgment Section */}
                {isCreator && creatorAssignment && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        {creatorAssignment.acknowledgmentStatus === 'Pending' ? (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Please Read and Acknowledge the Brief
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Before you can proceed with this campaign, please read the brief carefully and acknowledge that you understand the requirements.
                                </p>
                                <div className="flex gap-3">
                                    <Link
                                        to={`/campaigns/${id}/brief`}
                                        className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Read Brief & Acknowledge
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Brief acknowledged on {new Date(creatorAssignment.acknowledgedAt).toLocaleDateString()}</span>
                                </div>
                                <Link
                                    to={`/collaboration/${id}`}
                                    className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Open Collaboration Centre
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Brief Section */}
                {currentBrief && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Campaign Brief</h2>
                            <Link
                                to={`/campaigns/${id}/brief`}
                                className="text-purple-600 hover:text-purple-700 text-sm"
                            >
                                View Full Brief
                            </Link>
                        </div>
                        <div className="space-y-2 text-gray-600">
                            <p><span className="font-medium">Template:</span> {currentBrief.template}</p>
                            {currentBrief.sections?.campaignObjective && (
                                <p><span className="font-medium">Objective:</span> {currentBrief.sections.campaignObjective}</p>
                            )}
                        </div>
                    </div>
                )}

                        {/* Creators Section */}
                {isBrandOrAgency && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Assigned Creators</h2>
                            <Link
                                to={`/campaigns/${id}/assign-creators`}
                                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
                            >
                                <Users className="w-4 h-4" />
                                Assign Creators
                            </Link>
                        </div>
                        {currentCampaign.assignedCreators?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {currentCampaign.assignedCreators.map((assignment) => (
                                    <div key={assignment.creatorId._id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors relative">
                                        {isBrandOrAgency && (
                                            <button
                                                onClick={() => handleRemoveCreator(assignment.creatorId._id)}
                                                disabled={removingCreator === assignment.creatorId._id}
                                                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                                title="Remove creator"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                        <div className="flex items-center gap-3 mb-2">
                                            <img
                                                src={assignment.creatorId.profilePicture}
                                                alt={assignment.creatorId.username}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{assignment.creatorId.username}</p>
                                                <p className="text-sm text-gray-500">{assignment.creatorId.email}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
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
                                        {isBrandOrAgency && (
                                            <Link
                                                to={`/collaboration/${id}/${assignment.creatorId._id}`}
                                                className="mt-3 w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                Open Collaboration
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500 mb-2">No creators assigned yet</p>
                                <Link
                                    to={`/campaigns/${id}/assign-creators`}
                                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Assign Creators
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                    {/* Action Buttons */}
                    {isBrandOrAgency && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Management</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <Link
                                    to={`/campaigns/${id}/brief`}
                                    className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                                >
                                    <FileText className="w-6 h-6 text-gray-400 group-hover:text-purple-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 text-center">
                                        {currentBrief ? 'Edit Brief' : 'Create Brief'}
                                    </span>
                                </Link>
                                <Link
                                    to={`/campaigns/${id}/payments`}
                                    className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
                                >
                                    <DollarSign className="w-6 h-6 text-gray-400 group-hover:text-green-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 text-center">Payments</span>
                                </Link>
                                <Link
                                    to={`/campaigns/${id}/reports`}
                                    className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                >
                                    <BarChart3 className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 text-center">Reports</span>
                                </Link>
                                <Link
                                    to={`/campaigns/${id}/team`}
                                    className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                                >
                                    <Users2 className="w-6 h-6 text-gray-400 group-hover:text-purple-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 text-center">Team</span>
                                </Link>
                            </div>
                            {currentUser.userType === 'Agency' && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <Link
                                        to={`/campaigns/${id}/portal`}
                                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Building2 className="w-5 h-5" />
                                        Open Client Portal
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Deliverables Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Deliverables</h2>
                        {isBrandOrAgency && (
                            <Link
                                to={`/campaigns/${id}/deliverables/create`}
                                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Create Deliverable
                            </Link>
                        )}
                    </div>
                    {deliverables && deliverables.length > 0 ? (
                        <div className="space-y-4">
                            {deliverables.map((deliverable) => (
                                    <div key={deliverable._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">
                                                    {deliverable.contentType} - {deliverable.platform}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Creator: {deliverable.creatorId?.username}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    deliverable.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                    deliverable.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                                                    deliverable.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {deliverable.status}
                                                </span>
                                                <Link
                                                    to={`/deliverables/${deliverable._id}`}
                                                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                                {isBrandOrAgency && (deliverable.status === 'Draft Submitted' || deliverable.status === 'In Review') && (
                                                    <Link
                                                        to={`/deliverables/${deliverable._id}/review`}
                                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                                                    >
                                                        Review
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No deliverables yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}

