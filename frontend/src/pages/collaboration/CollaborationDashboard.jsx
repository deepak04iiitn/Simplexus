import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCampaign } from '../../redux/campaign/campaignSlice';
import { getBrief } from '../../redux/brief/briefSlice';
import { 
    ArrowLeft, MessageSquare, Upload, CheckCircle2, XCircle, Clock, 
    FileText, Video, Image, Link as LinkIcon, Send, Eye, Download,
    AlertCircle, Users, Tag, Calendar, DollarSign, BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CollaborationDashboard() {
    const { campaignId, creatorId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentCampaign } = useSelector((state) => state.campaign);
    const { currentBrief } = useSelector((state) => state.brief);
    const { currentUser } = useSelector((state) => state.user);

    const [activeTab, setActiveTab] = useState('overview');
    const [deliverables, setDeliverables] = useState([]);
    const [selectedDeliverable, setSelectedDeliverable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const isBrand = currentUser?.userType === 'Brand' || currentUser?.userType === 'Agency';
    const isCreator = currentUser?.userType === 'Creator';
    const targetCreatorId = creatorId || currentUser?._id;

    useEffect(() => {
        if (campaignId) {
            dispatch(getCampaign(campaignId));
            dispatch(getBrief(campaignId));
            fetchDeliverables();
        }
    }, [campaignId, dispatch]);

    const fetchDeliverables = async () => {
        try {
            const res = await fetch(`/backend/deliverables/campaign/${campaignId}`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                let deliverables = data.deliverables || [];
                // Filter by creator if viewing specific creator's deliverables
                if (targetCreatorId && isBrand) {
                    deliverables = deliverables.filter(d => 
                        (d.creatorId?._id || d.creatorId)?.toString() === targetCreatorId.toString()
                    );
                } else if (isCreator) {
                    // Creators only see their own deliverables
                    deliverables = deliverables.filter(d => 
                        (d.creatorId?._id || d.creatorId)?.toString() === currentUser?._id?.toString()
                    );
                }
                setDeliverables(deliverables);
            }
        } catch (error) {
            console.error('Failed to fetch deliverables:', error);
        } finally {
            setLoading(false);
        }
    };

    const creatorAssignment = currentCampaign?.assignedCreators?.find(
        c => (c.creatorId?._id || c.creatorId)?.toString() === targetCreatorId?.toString()
    );

    const creator = creatorAssignment?.creatorId || (isCreator ? currentUser : null);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Loading collaboration dashboard...</div>
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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to={`/campaigns/${campaignId}`}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Collaboration Centre
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {currentCampaign.name} {creator && `• ${creator.username || creator.email}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                currentCampaign.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                                currentCampaign.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {currentCampaign.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {[
                                { id: 'overview', label: 'Overview', icon: BarChart3 },
                                { id: 'brief', label: 'Brief', icon: FileText },
                                { id: 'deliverables', label: 'Deliverables', icon: Video },
                                { id: 'messages', label: 'Messages', icon: MessageSquare },
                                { id: 'timeline', label: 'Timeline', icon: Calendar },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                                            activeTab === tab.id
                                                ? 'border-purple-600 text-purple-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === 'overview' && (
                        <OverviewTab 
                            campaign={currentCampaign}
                            brief={currentBrief}
                            deliverables={deliverables}
                            creator={creator}
                            creatorAssignment={creatorAssignment}
                        />
                    )}

                    {activeTab === 'brief' && (
                        <BriefTab 
                            brief={currentBrief}
                            campaign={currentCampaign}
                            isCreator={isCreator}
                            campaignId={campaignId}
                        />
                    )}

                    {activeTab === 'deliverables' && (
                        <DeliverablesTab 
                            deliverables={deliverables}
                            campaign={currentCampaign}
                            isCreator={isCreator}
                            isBrand={isBrand}
                            onDeliverableSelect={setSelectedDeliverable}
                            onRefresh={fetchDeliverables}
                        />
                    )}

                    {activeTab === 'messages' && (
                        <MessagesTab 
                            campaignId={campaignId}
                            creatorId={targetCreatorId}
                            isCreator={isCreator}
                        />
                    )}

                    {activeTab === 'timeline' && (
                        <TimelineTab 
                            deliverables={deliverables}
                            campaign={currentCampaign}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

// Overview Tab Component
function OverviewTab({ campaign, brief, deliverables, creator, creatorAssignment }) {
    const stats = {
        total: deliverables.length,
        pending: deliverables.filter(d => d.status === 'Pending').length,
        inReview: deliverables.filter(d => d.status === 'In Review').length,
        approved: deliverables.filter(d => d.status === 'Approved').length,
        posted: deliverables.filter(d => d.status === 'Posted' || d.status === 'Completed').length,
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Total Deliverables</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">In Review</p>
                        <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.inReview}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Approved</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Posted</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{stats.posted}</p>
                    </div>
                </div>

                {/* Brief Summary */}
                {brief && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Brief Summary
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Template</p>
                                <p className="text-gray-900">{brief.template}</p>
                            </div>
                            {brief.sections?.campaignObjective && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Objective</p>
                                    <p className="text-gray-900">{brief.sections.campaignObjective}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Creator Status */}
                {creator && creatorAssignment && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Creator Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Brief Acknowledgment</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    creatorAssignment.acknowledgmentStatus === 'Acknowledged'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {creatorAssignment.acknowledgmentStatus}
                                </span>
                            </div>
                            {creatorAssignment.acknowledgedAt && (
                                <p className="text-sm text-gray-600">
                                    Acknowledged on {new Date(creatorAssignment.acknowledgedAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <Link
                            to={`/campaigns/${campaign._id}/brief`}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            View Full Brief
                        </Link>
                        <Link
                            to={`/campaigns/${campaign._id}`}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Back to Campaign
                        </Link>
                    </div>
                </div>

                {/* Campaign Info */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Info</h3>
                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="text-gray-600">Timeline</p>
                            <p className="text-gray-900">
                                {new Date(campaign.timeline.startDate).toLocaleDateString()} - {new Date(campaign.timeline.endDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Platforms</p>
                            <p className="text-gray-900">{campaign.platforms?.join(', ') || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Brief Tab Component
function BriefTab({ brief, campaign, isCreator, campaignId }) {
    if (!brief) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No brief available for this campaign yet.</p>
                {!isCreator && (
                    <Link
                        to={`/campaigns/${campaignId}/brief`}
                        className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Create Brief
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Campaign Brief</h2>
                <Link
                    to={`/campaigns/${campaignId}/brief`}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                    {isCreator ? 'View Full Brief' : 'Edit Brief'}
                </Link>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Template</h3>
                    <p className="text-gray-900">{brief.template}</p>
                </div>

                {brief.sections?.campaignObjective && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Campaign Objective</h3>
                        <p className="text-gray-900">{brief.sections.campaignObjective}</p>
                    </div>
                )}

                {brief.sections?.keyMessaging && brief.sections.keyMessaging.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Key Messaging</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-900">
                            {brief.sections.keyMessaging.map((item, index) => (
                                <li key={index}>{item.message || item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {brief.sections?.dosAndDonts && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {brief.sections.dosAndDonts.dos && brief.sections.dosAndDonts.dos.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-green-700 mb-2">Do's</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-900">
                                    {brief.sections.dosAndDonts.dos.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {brief.sections.dosAndDonts.donts && brief.sections.dosAndDonts.donts.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-red-700 mb-2">Don'ts</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-900">
                                    {brief.sections.dosAndDonts.donts.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {brief.sections?.hashtags && brief.sections.hashtags.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Hashtags</h3>
                        <div className="flex flex-wrap gap-2">
                            {brief.sections.hashtags.map((hashtag, index) => (
                                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                    {hashtag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {brief.sections?.postingTimeline && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Posting Timeline</h3>
                        <p className="text-gray-900">{brief.sections.postingTimeline}</p>
                    </div>
                )}

                {brief.sections?.contentGuidelines && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Content Guidelines</h3>
                        <p className="text-gray-900 whitespace-pre-wrap">{brief.sections.contentGuidelines}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Deliverables Tab Component
function DeliverablesTab({ deliverables, campaign, isCreator, isBrand, onDeliverableSelect, onRefresh }) {
    const [selectedDeliverable, setSelectedDeliverable] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [reviewing, setReviewing] = useState({});
    const [draftData, setDraftData] = useState({
        videoLink: '',
        thumbnailLink: '',
        driveLink: '',
        dropboxLink: '',
        notes: '',
    });

    const handleSubmitDraft = async (deliverableId) => {
        if (!draftData.videoLink && !draftData.driveLink && !draftData.dropboxLink) {
            toast.error('Please provide at least one link (video, drive, or dropbox)');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`/backend/deliverables/${deliverableId}/submit-draft`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(draftData),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Draft submitted successfully!');
                setDraftData({ videoLink: '', thumbnailLink: '', driveLink: '', dropboxLink: '', notes: '' });
                setSelectedDeliverable(null);
                onRefresh();
            } else {
                toast.error(data.message || 'Failed to submit draft');
            }
        } catch (error) {
            toast.error('Failed to submit draft');
        } finally {
            setSubmitting(false);
        }
    };

    const handleApproveReject = async (deliverableId, decision) => {
        const deliverable = deliverables.find(d => d._id === deliverableId);
        if (!deliverable || !deliverable.drafts || deliverable.drafts.length === 0) {
            toast.error('No draft to review');
            return;
        }

        setReviewing({ ...reviewing, [deliverableId]: true });
        try {
            const latestDraft = deliverable.drafts[deliverable.drafts.length - 1];
            const res = await fetch('/backend/reviews/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    deliverableId,
                    draftVersion: latestDraft.version,
                    decision: decision === 'approve' ? 'Approve' : 'Request Revision',
                    revisionNotes: decision === 'reject' ? 'Please revise and resubmit.' : '',
                }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`Deliverable ${decision === 'approve' ? 'approved' : 'revision requested'}!`);
                onRefresh();
            } else {
                toast.error(data.message || `Failed to ${decision} deliverable`);
            }
        } catch (error) {
            toast.error(`Failed to ${decision} deliverable`);
        } finally {
            setReviewing({ ...reviewing, [deliverableId]: false });
        }
    };

    if (deliverables.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No deliverables yet.</p>
                {isBrand && (
                    <Link
                        to={`/campaigns/${campaign._id}/deliverables/create`}
                        className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Create Deliverable
                    </Link>
                )}
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'In Review': return 'bg-yellow-100 text-yellow-800';
            case 'Draft Submitted': return 'bg-blue-100 text-blue-800';
            case 'Revision Requested': return 'bg-orange-100 text-orange-800';
            case 'Posted': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-4">
            {deliverables.map((deliverable) => {
                const latestDraft = deliverable.drafts && deliverable.drafts.length > 0 
                    ? deliverable.drafts[deliverable.drafts.length - 1] 
                    : null;
                const canSubmit = isCreator && (deliverable.status === 'Pending' || deliverable.status === 'Revision Requested');
                const canReview = isBrand && (deliverable.status === 'Draft Submitted' || deliverable.status === 'In Review') && latestDraft;

                return (
                    <div
                        key={deliverable._id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {deliverable.contentType} - {deliverable.platform}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(deliverable.status)}`}>
                                        {deliverable.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>Due: {new Date(deliverable.dueDate).toLocaleDateString()}</span>
                                    </div>
                                    {deliverable.currentVersion > 0 && (
                                        <div className="flex items-center gap-1">
                                            <FileText className="w-4 h-4" />
                                            <span>Version {deliverable.currentVersion}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Link
                                to={`/deliverables/${deliverable._id}`}
                                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            >
                                <Eye className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Draft Links Display */}
                        {latestDraft && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-2">Latest Draft (V{latestDraft.version}):</p>
                                <div className="space-y-1 text-sm">
                                    {latestDraft.videoLink && (
                                        <a href={latestDraft.videoLink} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline flex items-center gap-1">
                                            <LinkIcon className="w-4 h-4" />
                                            Video Link
                                        </a>
                                    )}
                                    {latestDraft.driveLink && (
                                        <a href={latestDraft.driveLink} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline flex items-center gap-1">
                                            <LinkIcon className="w-4 h-4" />
                                            Drive Link
                                        </a>
                                    )}
                                    {latestDraft.dropboxLink && (
                                        <a href={latestDraft.dropboxLink} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline flex items-center gap-1">
                                            <LinkIcon className="w-4 h-4" />
                                            Dropbox Link
                                        </a>
                                    )}
                                    {latestDraft.notes && (
                                        <p className="text-gray-600 mt-2">{latestDraft.notes}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Creator Submit Draft Form */}
                        {canSubmit && selectedDeliverable === deliverable._id && (
                            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-medium text-gray-900 mb-3">Submit Draft</h4>
                                <div className="space-y-3">
                                    <input
                                        type="url"
                                        placeholder="Video Link"
                                        value={draftData.videoLink}
                                        onChange={(e) => setDraftData(prev => ({ ...prev, videoLink: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="url"
                                            placeholder="Google Drive Link"
                                            value={draftData.driveLink}
                                            onChange={(e) => setDraftData(prev => ({ ...prev, driveLink: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                        <input
                                            type="url"
                                            placeholder="Dropbox Link"
                                            value={draftData.dropboxLink}
                                            onChange={(e) => setDraftData(prev => ({ ...prev, dropboxLink: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Notes (optional)"
                                        value={draftData.notes}
                                        onChange={(e) => setDraftData(prev => ({ ...prev, notes: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        rows="2"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleSubmitDraft(deliverable._id)}
                                            disabled={submitting}
                                            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:opacity-50"
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Draft'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedDeliverable(null);
                                                setDraftData({ videoLink: '', thumbnailLink: '', driveLink: '', dropboxLink: '', notes: '' });
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            {canSubmit && selectedDeliverable !== deliverable._id && (
                                <button
                                    onClick={() => setSelectedDeliverable(deliverable._id)}
                                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                                >
                                    <Upload className="w-4 h-4" />
                                    Submit Draft
                                </button>
                            )}
                            {canReview && (
                                <>
                                    <button
                                        onClick={() => handleApproveReject(deliverable._id, 'approve')}
                                        disabled={reviewing[deliverable._id]}
                                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        {reviewing[deliverable._id] ? 'Processing...' : 'Approve'}
                                    </button>
                                    <button
                                        onClick={() => handleApproveReject(deliverable._id, 'reject')}
                                        disabled={reviewing[deliverable._id]}
                                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        {reviewing[deliverable._id] ? 'Processing...' : 'Request Revision'}
                                    </button>
                                    <Link
                                        to={`/deliverables/${deliverable._id}/review`}
                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Detailed Review
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Messages Tab Component
function MessagesTab({ campaignId, creatorId, isCreator }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, [campaignId, creatorId]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/backend/collaboration/${campaignId}/messages${creatorId ? `?creatorId=${creatorId}` : ''}`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setMessages(data.messages || []);
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const res = await fetch(`/backend/collaboration/${campaignId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    creatorId: creatorId || undefined,
                    content: newMessage,
                    isInternal: false,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setNewMessage('');
                fetchMessages();
                toast.success('Message sent');
            } else {
                toast.error(data.message || 'Failed to send message');
            }
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
            </div>
            <div className="p-6 space-y-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {messages.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No messages yet. Start the conversation!</p>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message._id}
                            className={`flex ${message.isInternal ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.isInternal
                                    ? 'bg-purple-100 text-purple-900'
                                    : 'bg-gray-100 text-gray-900'
                            }`}>
                                <p className="text-sm font-medium mb-1">{message.senderId?.username || 'User'}</p>
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(message.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-200">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}

// Timeline Tab Component
function TimelineTab({ deliverables, campaign }) {
    const events = [];

    // Add campaign start
    events.push({
        type: 'campaign',
        title: 'Campaign Started',
        date: campaign.timeline.startDate,
        status: 'completed',
    });

    // Add deliverable events
    deliverables.forEach((deliverable) => {
        if (deliverable.drafts && deliverable.drafts.length > 0) {
            deliverable.drafts.forEach((draft) => {
                events.push({
                    type: 'draft',
                    title: `Draft V${draft.version} Submitted`,
                    date: draft.submittedAt,
                    deliverable: deliverable,
                    status: draft.status === 'Approved' ? 'completed' : 'pending',
                });
            });
        }
        if (deliverable.postingDetails?.postTimestamp) {
            events.push({
                type: 'post',
                title: 'Content Posted',
                date: deliverable.postingDetails.postTimestamp,
                deliverable: deliverable,
                status: 'completed',
            });
        }
    });

    // Sort by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Timeline</h2>
            <div className="space-y-6">
                {events.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No timeline events yet.</p>
                ) : (
                    events.map((event, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full ${
                                    event.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                                }`} />
                                {index < events.length - 1 && (
                                    <div className="w-0.5 h-full bg-gray-200 mt-2" />
                                )}
                            </div>
                            <div className="flex-1 pb-6">
                                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                                {event.deliverable && (
                                    <p className="text-sm text-gray-600">
                                        {event.deliverable.contentType} - {event.deliverable.platform}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(event.date).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

