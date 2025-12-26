import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBrief, updateBrief, getBrief } from '../../redux/brief/briefSlice';
import { getCampaign, acknowledgeBrief } from '../../redux/campaign/campaignSlice';
import { ArrowLeft, Save, Plus, X, Check, Eye, Lock, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const TEMPLATES = ['Review', 'Unboxing', 'Reel', 'Tutorial', 'POV', 'Story', 'Post', 'Video', 'Custom'];

export default function BriefBuilder() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentBrief, loading } = useSelector((state) => state.brief);
    const { currentCampaign } = useSelector((state) => state.campaign);
    const { currentUser } = useSelector((state) => state.user);

    // Determine if user is in read-only mode (creators can only view)
    const isReadOnly = currentUser && currentUser.userType === 'Creator';

    const [acknowledging, setAcknowledging] = useState(false);
    const [template, setTemplate] = useState('Custom');
    const [sections, setSections] = useState({
        campaignObjective: '',
        keyMessaging: [],
        dosAndDonts: { dos: [], donts: [] },
        scriptDirections: '',
        brandAssets: [],
        hashtags: [],
        mentions: [],
        postingTimeline: '',
        revisionTimeline: '',
        contentGuidelines: '',
        examples: [],
    });

    useEffect(() => {
        dispatch(getCampaign(id));
        dispatch(getBrief(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (currentBrief) {
            setTemplate(currentBrief.template);
            setSections(currentBrief.sections || sections);
        }
    }, [currentBrief]);

    const addKeyMessage = () => {
        setSections(prev => ({
            ...prev,
            keyMessaging: [...prev.keyMessaging, { message: '', checked: false }],
        }));
    };

    const updateKeyMessage = (index, value) => {
        setSections(prev => ({
            ...prev,
            keyMessaging: prev.keyMessaging.map((item, i) => 
                i === index ? { ...item, message: value } : item
            ),
        }));
    };

    const removeKeyMessage = (index) => {
        setSections(prev => ({
            ...prev,
            keyMessaging: prev.keyMessaging.filter((_, i) => i !== index),
        }));
    };

    const addDo = () => {
        setSections(prev => ({
            ...prev,
            dosAndDonts: { ...prev.dosAndDonts, dos: [...prev.dosAndDonts.dos, ''] },
        }));
    };

    const addDont = () => {
        setSections(prev => ({
            ...prev,
            dosAndDonts: { ...prev.dosAndDonts, donts: [...prev.dosAndDonts.donts, ''] },
        }));
    };

    const updateDo = (index, value) => {
        setSections(prev => ({
            ...prev,
            dosAndDonts: {
                ...prev.dosAndDonts,
                dos: prev.dosAndDonts.dos.map((item, i) => i === index ? value : item),
            },
        }));
    };

    const updateDont = (index, value) => {
        setSections(prev => ({
            ...prev,
            dosAndDonts: {
                ...prev.dosAndDonts,
                donts: prev.dosAndDonts.donts.map((item, i) => i === index ? value : item),
            },
        }));
    };

    const addHashtag = () => {
        setSections(prev => ({
            ...prev,
            hashtags: [...prev.hashtags, ''],
        }));
    };

    const updateHashtag = (index, value) => {
        setSections(prev => ({
            ...prev,
            hashtags: prev.hashtags.map((item, i) => i === index ? value : item),
        }));
    };

    const addAsset = () => {
        setSections(prev => ({
            ...prev,
            brandAssets: [...prev.brandAssets, { name: '', url: '', type: 'image' }],
        }));
    };

    const updateAsset = (index, field, value) => {
        setSections(prev => ({
            ...prev,
            brandAssets: prev.brandAssets.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    };

    const handleSave = async () => {
        // Double-check permissions before saving
        if (isReadOnly) {
            toast.error('You do not have permission to edit briefs');
            return;
        }

        try {
            if (currentBrief) {
                await dispatch(updateBrief({ id: currentBrief._id, sections })).unwrap();
                toast.success('Brief updated successfully!');
            } else {
                await dispatch(createBrief({ campaignId: id, template, sections })).unwrap();
                toast.success('Brief created successfully!');
            }
            navigate(`/campaigns/${id}`);
        } catch (error) {
            toast.error(error || 'Failed to save brief');
        }
    };

    const handleAcknowledgeBrief = async () => {
        if (!currentUser || !currentCampaign || !isReadOnly) return;

        setAcknowledging(true);
        try {
            await dispatch(acknowledgeBrief(id)).unwrap();
            toast.success('Brief acknowledged successfully!');
            // Refresh campaign data to get updated acknowledgment status
            dispatch(getCampaign(id));
        } catch (error) {
            toast.error(error || 'Failed to acknowledge brief');
        } finally {
            setAcknowledging(false);
        }
    };

    // Get creator assignment to check acknowledgment status
    const creatorAssignment = currentCampaign?.assignedCreators?.find(
        c => c.creatorId?._id === currentUser?._id || c.creatorId?._id?.toString() === currentUser?._id?.toString()
    );
    const isAcknowledged = creatorAssignment?.acknowledgmentStatus === 'Acknowledged';

    if (!currentCampaign) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    }

    // Show message if no brief exists and user is creator
    if (!currentBrief && isReadOnly) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">No brief available for this campaign yet.</p>
                    <Link to={`/campaigns/${id}`} className="text-purple-600 hover:text-purple-700">
                        Back to Campaign
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    to={`/campaigns/${id}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Campaign
                </Link>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {isReadOnly ? 'Campaign Brief' : 'Interactive Brief Builder'}
                                </h1>
                                {isReadOnly && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                        <Lock className="w-4 h-4" />
                                        <span>Read Only</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-600 mt-1">{currentCampaign.name}</p>
                        </div>
                        {!isReadOnly && (
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? 'Saving...' : 'Save Brief'}
                            </button>
                        )}
                    </div>

                    {/* Template Selection */}
                    {!isReadOnly && (
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Select Template
                            </label>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                {TEMPLATES.map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setTemplate(t)}
                                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                                            template === t
                                                ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {isReadOnly && currentBrief && (
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Template
                            </label>
                            <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                {currentBrief.template || 'Custom'}
                            </div>
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Campaign Objective */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Campaign Objective
                            </label>
                            {isReadOnly ? (
                                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 min-h-[80px]">
                                    {sections.campaignObjective || <span className="text-gray-400">Not specified</span>}
                                </div>
                            ) : (
                                <textarea
                                    value={sections.campaignObjective}
                                    onChange={(e) => setSections(prev => ({ ...prev, campaignObjective: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="What is the main goal of this campaign?"
                                />
                            )}
                        </div>

                        {/* Key Messaging */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Key Messaging
                                </label>
                                {!isReadOnly && (
                                    <button
                                        type="button"
                                        onClick={addKeyMessage}
                                        className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Message
                                    </button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {sections.keyMessaging && sections.keyMessaging.length > 0 ? (
                                    sections.keyMessaging.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            {isReadOnly ? (
                                                <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                                    {item.message || <span className="text-gray-400">Empty</span>}
                                                </div>
                                            ) : (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={item.message}
                                                        onChange={(e) => updateKeyMessage(index, e.target.value)}
                                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        placeholder="Key message point"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeKeyMessage(index)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-gray-400 italic">No key messages specified</div>
                                )}
                            </div>
                        </div>

                        {/* Do's and Don'ts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Do's</label>
                                    {!isReadOnly && (
                                        <button
                                            type="button"
                                            onClick={addDo}
                                            className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {sections.dosAndDonts.dos && sections.dosAndDonts.dos.length > 0 ? (
                                        sections.dosAndDonts.dos.map((item, index) => (
                                            isReadOnly ? (
                                                <div key={index} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                                    {item || <span className="text-gray-400">Empty</span>}
                                                </div>
                                            ) : (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => updateDo(index, e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="What to do"
                                                />
                                            )
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-gray-400 italic">No do's specified</div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Don'ts</label>
                                    {!isReadOnly && (
                                        <button
                                            type="button"
                                            onClick={addDont}
                                            className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {sections.dosAndDonts.donts && sections.dosAndDonts.donts.length > 0 ? (
                                        sections.dosAndDonts.donts.map((item, index) => (
                                            isReadOnly ? (
                                                <div key={index} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                                    {item || <span className="text-gray-400">Empty</span>}
                                                </div>
                                            ) : (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => updateDont(index, e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                    placeholder="What not to do"
                                                />
                                            )
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-gray-400 italic">No don'ts specified</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Script Directions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Script Directions (Optional)
                            </label>
                            {isReadOnly ? (
                                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 min-h-[100px]">
                                    {sections.scriptDirections || <span className="text-gray-400">Not specified</span>}
                                </div>
                            ) : (
                                <textarea
                                    value={sections.scriptDirections}
                                    onChange={(e) => setSections(prev => ({ ...prev, scriptDirections: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    rows="4"
                                    placeholder="Provide script guidance or talking points..."
                                />
                            )}
                        </div>

                        {/* Hashtags */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">Hashtags</label>
                                {!isReadOnly && (
                                    <button
                                        type="button"
                                        onClick={addHashtag}
                                        className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Hashtag
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {sections.hashtags && sections.hashtags.length > 0 ? (
                                    sections.hashtags.map((hashtag, index) => (
                                        isReadOnly ? (
                                            <div key={index} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                                {hashtag}
                                            </div>
                                        ) : (
                                            <input
                                                key={index}
                                                type="text"
                                                value={hashtag}
                                                onChange={(e) => updateHashtag(index, e.target.value)}
                                                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="#hashtag"
                                            />
                                        )
                                    ))
                                ) : (
                                    <div className="px-3 py-1 text-gray-400 italic">No hashtags specified</div>
                                )}
                            </div>
                        </div>

                        {/* Posting Timeline */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Posting Timeline
                            </label>
                            {isReadOnly ? (
                                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                    {sections.postingTimeline || <span className="text-gray-400">Not specified</span>}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    value={sections.postingTimeline}
                                    onChange={(e) => setSections(prev => ({ ...prev, postingTimeline: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="e.g., Post between June 1-5, 2024"
                                />
                            )}
                        </div>

                        {/* Content Guidelines */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content Guidelines
                            </label>
                            {isReadOnly ? (
                                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 min-h-[100px]">
                                    {sections.contentGuidelines || <span className="text-gray-400">Not specified</span>}
                                </div>
                            ) : (
                                <textarea
                                    value={sections.contentGuidelines}
                                    onChange={(e) => setSections(prev => ({ ...prev, contentGuidelines: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    rows="4"
                                    placeholder="Additional guidelines for content creation..."
                                />
                            )}
                        </div>

                        {/* Acknowledge Button for Creators */}
                        {isReadOnly && currentBrief && (
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                {!isAcknowledged ? (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <CheckCircle2 className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    Acknowledge Brief
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    Please read through the brief carefully. Once you acknowledge, you confirm that you understand all the requirements and guidelines for this campaign.
                                                </p>
                                                <button
                                                    onClick={handleAcknowledgeBrief}
                                                    disabled={acknowledging}
                                                    className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Brief Acknowledged
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    You acknowledged this brief on {creatorAssignment?.acknowledgedAt 
                                                        ? new Date(creatorAssignment.acknowledgedAt).toLocaleDateString()
                                                        : 'recently'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

