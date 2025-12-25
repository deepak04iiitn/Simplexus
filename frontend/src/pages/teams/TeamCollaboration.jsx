import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Users, UserPlus, Mail, MessageSquare, Tag, Lock, Globe, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeamCollaboration() {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [newMember, setNewMember] = useState({
        email: '',
        role: 'Member',
    });
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({
        content: '',
        isInternal: false,
        taggedUsers: [],
    });

    useEffect(() => {
        fetchCampaign();
        fetchComments();
    }, [id]);

    const fetchCampaign = async () => {
        try {
            const res = await fetch(`/backend/campaigns/${id}`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setCampaign(data.campaign);
            }
        } catch (error) {
            toast.error('Failed to load campaign');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        // Fetch team comments for this campaign
        // This would be a new endpoint or part of campaign data
        // For now, we'll use a placeholder
    };

    const handleAddTeamMember = async (e) => {
        e.preventDefault();
        
        if (!newMember.email) {
            toast.error('Please enter an email address');
            return;
        }

        try {
            // First, we need to find the user by email
            // Then add them to the team
            const res = await fetch(`/backend/campaigns/${id}/team-members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email: newMember.email,
                    role: newMember.role,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Team member added successfully!');
                setShowAddMemberModal(false);
                setNewMember({ email: '', role: 'Member' });
                fetchCampaign();
            } else {
                toast.error(data.message || 'Failed to add team member');
            }
        } catch (error) {
            toast.error('Failed to add team member');
        }
    };

    const handleAddComment = async () => {
        if (!newComment.content.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        // Add comment to campaign
        // This would be stored as a campaign comment or note
        setComments(prev => [...prev, {
            ...newComment,
            author: 'Current User', // Replace with actual user
            createdAt: new Date(),
        }]);

        setNewComment({
            content: '',
            isInternal: false,
            taggedUsers: [],
        });
        toast.success('Comment added');
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Owner': return 'bg-purple-100 text-purple-800';
            case 'Admin': return 'bg-blue-100 text-blue-800';
            case 'Member': return 'bg-gray-100 text-gray-800';
            case 'Viewer': return 'bg-green-100 text-green-800';
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

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Team Collaboration</h1>
                        <p className="text-gray-600 mt-1">{campaign.name}</p>
                    </div>
                    <button
                        onClick={() => setShowAddMemberModal(true)}
                        className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <UserPlus className="w-5 h-5" />
                        Add Team Member
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Team Members */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
                                <Users className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="space-y-3">
                                {campaign.teamMembers && campaign.teamMembers.length > 0 ? (
                                    campaign.teamMembers.map((member) => (
                                        <div key={member.userId._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <img
                                                src={member.userId.profilePicture}
                                                alt={member.userId.username}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{member.userId.username}</p>
                                                <p className="text-sm text-gray-500">{member.userId.email}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(member.role)}`}>
                                                {member.role}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No team members yet</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Comments & Notes */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Notes & Comments</h2>
                            
                            {/* Add Comment Form */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Add Comment or Note
                                        </label>
                                        <textarea
                                            value={newComment.content}
                                            onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            rows="3"
                                            placeholder="Add a comment or note for the team..."
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={newComment.isInternal}
                                                onChange={(e) => setNewComment(prev => ({ ...prev, isInternal: e.target.checked }))}
                                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                            />
                                            <span className="text-sm text-gray-700 flex items-center gap-1">
                                                <Lock className="w-4 h-4" />
                                                Internal note (not visible to creator)
                                            </span>
                                        </label>
                                    </div>
                                    <button
                                        onClick={handleAddComment}
                                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Add Comment
                                    </button>
                                </div>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-4">
                                {comments.length > 0 ? (
                                    comments.map((comment, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 rounded-lg border ${
                                                comment.isInternal
                                                    ? 'bg-yellow-50 border-yellow-200'
                                                    : 'bg-white border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">{comment.author}</span>
                                                    {comment.isInternal ? (
                                                        <span className="flex items-center gap-1 text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                                                            <Lock className="w-3 h-3" />
                                                            Internal
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                                                            <Globe className="w-3 h-3" />
                                                            Shared
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700">{comment.content}</p>
                                            {comment.taggedUsers && comment.taggedUsers.length > 0 && (
                                                <div className="mt-2 flex items-center gap-1 flex-wrap">
                                                    <Tag className="w-4 h-4 text-gray-400" />
                                                    {comment.taggedUsers.map((user, i) => (
                                                        <span key={i} className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                                            @{user}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p>No comments yet. Start the conversation!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Team Member Modal */}
                {showAddMemberModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">Add Team Member</h2>
                                <button
                                    onClick={() => setShowAddMemberModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleAddTeamMember} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={newMember.email}
                                        onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="user@example.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Role
                                    </label>
                                    <select
                                        value={newMember.role}
                                        onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="Member">Member</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Viewer">Viewer</option>
                                    </select>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Add Member
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddMemberModal(false)}
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

