import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBrief, updateBrief, getBrief } from '../../redux/brief/briefSlice';
import { getCampaign } from '../../redux/campaign/campaignSlice';
import { ArrowLeft, Save, Plus, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const TEMPLATES = ['Review', 'Unboxing', 'Reel', 'Tutorial', 'POV', 'Story', 'Post', 'Video', 'Custom'];

export default function BriefBuilder() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentBrief, loading } = useSelector((state) => state.brief);
    const { currentCampaign } = useSelector((state) => state.campaign);
    const { currentUser } = useSelector((state) => state.user);

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

    if (!currentCampaign) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
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
                            <h1 className="text-3xl font-bold text-gray-900">Interactive Brief Builder</h1>
                            <p className="text-gray-600 mt-1">{currentCampaign.name}</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Saving...' : 'Save Brief'}
                        </button>
                    </div>

                    {/* Template Selection */}
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

                    <div className="space-y-8">
                        {/* Campaign Objective */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Campaign Objective
                            </label>
                            <textarea
                                value={sections.campaignObjective}
                                onChange={(e) => setSections(prev => ({ ...prev, campaignObjective: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                rows="3"
                                placeholder="What is the main goal of this campaign?"
                            />
                        </div>

                        {/* Key Messaging */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Key Messaging
                                </label>
                                <button
                                    type="button"
                                    onClick={addKeyMessage}
                                    className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Message
                                </button>
                            </div>
                            <div className="space-y-2">
                                {sections.keyMessaging.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
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
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Do's and Don'ts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Do's</label>
                                    <button
                                        type="button"
                                        onClick={addDo}
                                        className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {sections.dosAndDonts.dos.map((item, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            value={item}
                                            onChange={(e) => updateDo(index, e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="What to do"
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Don'ts</label>
                                    <button
                                        type="button"
                                        onClick={addDont}
                                        className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {sections.dosAndDonts.donts.map((item, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            value={item}
                                            onChange={(e) => updateDont(index, e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="What not to do"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Script Directions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Script Directions (Optional)
                            </label>
                            <textarea
                                value={sections.scriptDirections}
                                onChange={(e) => setSections(prev => ({ ...prev, scriptDirections: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                rows="4"
                                placeholder="Provide script guidance or talking points..."
                            />
                        </div>

                        {/* Hashtags */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">Hashtags</label>
                                <button
                                    type="button"
                                    onClick={addHashtag}
                                    className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Hashtag
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {sections.hashtags.map((hashtag, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={hashtag}
                                        onChange={(e) => updateHashtag(index, e.target.value)}
                                        className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="#hashtag"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Posting Timeline */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Posting Timeline
                            </label>
                            <input
                                type="text"
                                value={sections.postingTimeline}
                                onChange={(e) => setSections(prev => ({ ...prev, postingTimeline: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., Post between June 1-5, 2024"
                            />
                        </div>

                        {/* Content Guidelines */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content Guidelines
                            </label>
                            <textarea
                                value={sections.contentGuidelines}
                                onChange={(e) => setSections(prev => ({ ...prev, contentGuidelines: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                rows="4"
                                placeholder="Additional guidelines for content creation..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

