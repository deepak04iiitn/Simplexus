import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitDraft, submitPostProof, getDeliverables } from '../../redux/deliverable/deliverableSlice';
import { ArrowLeft, Upload, Link as LinkIcon, CheckCircle2, Clock, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeliverableDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { deliverables } = useSelector((state) => state.deliverable);
    const { currentUser } = useSelector((state) => state.user);

    const deliverable = deliverables.find(d => d._id === id);
    const isCreator = currentUser?.userType === 'Creator';
    const isBrandOrAgency = currentUser?.userType === 'Brand' || currentUser?.userType === 'Agency';

    const [draftData, setDraftData] = useState({
        videoLink: '',
        thumbnailLink: '',
        driveLink: '',
        dropboxLink: '',
        notes: '',
    });

    const [postData, setPostData] = useState({
        postUrl: '',
        screenshotUrl: '',
        postTimestamp: '',
        caption: '',
        hashtags: '',
    });

    const handleSubmitDraft = async (e) => {
        e.preventDefault();
        
        if (!draftData.videoLink && !draftData.driveLink && !draftData.dropboxLink) {
            toast.error('Please provide at least one link (video, drive, or dropbox)');
            return;
        }

        try {
            await dispatch(submitDraft({ id, draftData })).unwrap();
            toast.success('Draft submitted successfully!');
            setDraftData({ videoLink: '', thumbnailLink: '', driveLink: '', dropboxLink: '', notes: '' });
            dispatch(getDeliverables(deliverable.campaignId));
        } catch (error) {
            toast.error(error || 'Failed to submit draft');
        }
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();
        
        if (!postData.postUrl) {
            toast.error('Please provide the post URL');
            return;
        }

        try {
            await dispatch(submitPostProof({
                id,
                postData: {
                    ...postData,
                    hashtags: postData.hashtags.split(',').map(h => h.trim()).filter(h => h),
                },
            })).unwrap();
            toast.success('Post proof submitted successfully!');
            setPostData({ postUrl: '', screenshotUrl: '', postTimestamp: '', caption: '', hashtags: '' });
            dispatch(getDeliverables(deliverable.campaignId));
        } catch (error) {
            toast.error(error || 'Failed to submit post proof');
        }
    };

    if (!deliverable) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Deliverable not found</p>
                    <Link to="/dashboard" className="text-purple-600 hover:text-purple-700">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const latestDraft = deliverable.drafts[deliverable.drafts.length - 1];
    const canSubmitPost = deliverable.status === 'Approved';

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    to={`/campaigns/${deliverable.campaignId}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Campaign
                </Link>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {deliverable.contentType} - {deliverable.platform}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Creator: {deliverable.creatorId?.username}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            deliverable.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            deliverable.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                            deliverable.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {deliverable.status}
                        </span>
                    </div>
                </div>

                {/* Draft Submission (Creator Only) */}
                {isCreator && deliverable.creatorId._id === currentUser._id && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit Draft</h2>
                        <form onSubmit={handleSubmitDraft} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Video Link
                                </label>
                                <input
                                    type="url"
                                    value={draftData.videoLink}
                                    onChange={(e) => setDraftData(prev => ({ ...prev, videoLink: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thumbnail Link (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={draftData.thumbnailLink}
                                    onChange={(e) => setDraftData(prev => ({ ...prev, thumbnailLink: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Google Drive Link
                                    </label>
                                    <input
                                        type="url"
                                        value={draftData.driveLink}
                                        onChange={(e) => setDraftData(prev => ({ ...prev, driveLink: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="https://drive.google.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dropbox Link
                                    </label>
                                    <input
                                        type="url"
                                        value={draftData.dropboxLink}
                                        onChange={(e) => setDraftData(prev => ({ ...prev, dropboxLink: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="https://dropbox.com/..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={draftData.notes}
                                    onChange={(e) => setDraftData(prev => ({ ...prev, notes: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Additional notes about this draft..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Submit Draft
                            </button>
                        </form>
                    </div>
                )}

                {/* Post Submission (Creator Only, After Approval) */}
                {isCreator && deliverable.creatorId._id === currentUser._id && canSubmitPost && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit Post Proof</h2>
                        <form onSubmit={handleSubmitPost} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Post URL *
                                </label>
                                <input
                                    type="url"
                                    value={postData.postUrl}
                                    onChange={(e) => setPostData(prev => ({ ...prev, postUrl: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="https://instagram.com/p/..."
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Screenshot URL (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={postData.screenshotUrl}
                                        onChange={(e) => setPostData(prev => ({ ...prev, screenshotUrl: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Post Timestamp
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={postData.postTimestamp}
                                        onChange={(e) => setPostData(prev => ({ ...prev, postTimestamp: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Caption (Optional)
                                </label>
                                <textarea
                                    value={postData.caption}
                                    onChange={(e) => setPostData(prev => ({ ...prev, caption: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hashtags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={postData.hashtags}
                                    onChange={(e) => setPostData(prev => ({ ...prev, hashtags: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="#hashtag1, #hashtag2"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Submit Post Proof
                            </button>
                        </form>
                    </div>
                )}

                {/* Draft History */}
                {deliverable.drafts.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Draft History</h2>
                        <div className="space-y-4">
                            {deliverable.drafts.map((draft, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900">Version {draft.version}</span>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            draft.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                            draft.status === 'Revision Requested' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {draft.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        {draft.videoLink && (
                                            <div>
                                                <LinkIcon className="w-4 h-4 inline mr-1" />
                                                <a href={draft.videoLink} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                                                    Video Link
                                                </a>
                                            </div>
                                        )}
                                        {draft.driveLink && (
                                            <div>
                                                <LinkIcon className="w-4 h-4 inline mr-1" />
                                                <a href={draft.driveLink} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                                                    Drive Link
                                                </a>
                                            </div>
                                        )}
                                        {draft.dropboxLink && (
                                            <div>
                                                <LinkIcon className="w-4 h-4 inline mr-1" />
                                                <a href={draft.dropboxLink} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                                                    Dropbox Link
                                                </a>
                                            </div>
                                        )}
                                        {draft.notes && (
                                            <p className="mt-2">{draft.notes}</p>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Submitted: {new Date(draft.submittedAt).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Post Details (If Posted) */}
                {deliverable.postingDetails?.postUrl && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Post Details</h2>
                        <div className="space-y-2">
                            <div>
                                <span className="font-medium text-gray-700">Post URL: </span>
                                <a href={deliverable.postingDetails.postUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                                    {deliverable.postingDetails.postUrl}
                                </a>
                            </div>
                            {deliverable.postingDetails.postTimestamp && (
                                <div>
                                    <span className="font-medium text-gray-700">Posted: </span>
                                    <span className="text-gray-600">
                                        {new Date(deliverable.postingDetails.postTimestamp).toLocaleString()}
                                    </span>
                                </div>
                            )}
                            {deliverable.postingDetails.verified && (
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Verified</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

