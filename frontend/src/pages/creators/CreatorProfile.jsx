import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Instagram, Youtube, Twitter, Linkedin, Facebook, Star, TrendingUp, CheckCircle2, Clock, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreatorProfile() {
    const { userId, slug } = useParams();
    const [profile, setProfile] = useState(null);
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchProfile();
    }, [userId, slug]);

    const fetchProfile = async () => {
        try {
            let res;
            if (slug) {
                res = await fetch(`/backend/creator-profiles/slug/${slug}`, {
                    credentials: 'include',
                });
            } else {
                res = await fetch(`/backend/creator-profiles/user/${userId}`, {
                    credentials: 'include',
                });
            }

            const data = await res.json();
            if (res.ok) {
                setProfile(data.profile);
                fetchResume(data.profile.userId._id);
            } else {
                toast.error(data.message || 'Profile not found');
            }
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchResume = async (creatorUserId) => {
        try {
            const res = await fetch(`/backend/creator-profiles/${creatorUserId}/resume`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setResume(data.resume);
            }
        } catch (error) {
            console.error('Failed to load resume');
        }
    };

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'Instagram': return <Instagram className="w-5 h-5" />;
            case 'YouTube': return <Youtube className="w-5 h-5" />;
            case 'Twitter': return <Twitter className="w-5 h-5" />;
            case 'LinkedIn': return <Linkedin className="w-5 h-5" />;
            case 'Facebook': return <Facebook className="w-5 h-5" />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Loading profile...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Profile not found</p>
                    <Link to="/dashboard" className="text-purple-600 hover:text-purple-700">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const user = profile.userId;
    const stats = profile.stats || {};

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="w-32 h-32 rounded-full border-4 border-purple-100"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
                            {profile.bio && (
                                <p className="text-gray-600 mb-4">{profile.bio}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                {profile.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>
                                            {profile.location.city && `${profile.location.city}, `}
                                            {profile.location.state && `${profile.location.state}, `}
                                            {profile.location.country}
                                        </span>
                                    </div>
                                )}
                                {profile.niche && profile.niche.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Niche:</span>
                                        <div className="flex gap-1">
                                            {profile.niche.map((n, i) => (
                                                <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                                    {n}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Campaigns</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCampaigns || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Deliverables</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completedDeliverables || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">On-Time Rate</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                            {stats.onTimeRate?.toFixed(0) || 0}%
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Avg Revisions</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {stats.averageRevisionCount?.toFixed(1) || 0}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="border-b border-gray-200">
                        <div className="flex space-x-8 px-6">
                            {['overview', 'platforms', 'portfolio', 'resume'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                                        activeTab === tab
                                            ? 'border-purple-600 text-purple-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {profile.bio && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                                        <p className="text-gray-600">{profile.bio}</p>
                                    </div>
                                )}

                                {profile.testimonials && profile.testimonials.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Testimonials</h3>
                                        <div className="space-y-4">
                                            {profile.testimonials.map((testimonial, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${
                                                                    i < testimonial.rating
                                                                        ? 'text-yellow-400 fill-current'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                        <span className="text-sm text-gray-600 ml-2">
                                                            {testimonial.fromUserId?.username}
                                                        </span>
                                                    </div>
                                                    {testimonial.comment && (
                                                        <p className="text-gray-700">{testimonial.comment}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {profile.pricing && profile.pricing.packages && profile.pricing.packages.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Packages</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {profile.pricing.packages.map((pkg, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                    <h4 className="font-semibold text-gray-900 mb-1">{pkg.name}</h4>
                                                    <p className="text-2xl font-bold text-purple-600 mb-2">
                                                        ${pkg.price}
                                                    </p>
                                                    {pkg.description && (
                                                        <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                                                    )}
                                                    {pkg.deliverables && pkg.deliverables.length > 0 && (
                                                        <ul className="text-sm text-gray-600 space-y-1">
                                                            {pkg.deliverables.map((item, i) => (
                                                                <li key={i} className="flex items-center gap-1">
                                                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Platforms Tab */}
                        {activeTab === 'platforms' && (
                            <div className="space-y-4">
                                {profile.platforms && profile.platforms.length > 0 ? (
                                    profile.platforms.map((platform, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {getPlatformIcon(platform.platform)}
                                                    <div>
                                                        <p className="font-medium text-gray-900">{platform.platform}</p>
                                                        {platform.handle && (
                                                            <p className="text-sm text-gray-600">@{platform.handle}</p>
                                                        )}
                                                    </div>
                                                    {platform.verified && (
                                                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    {platform.followers && (
                                                        <p className="font-semibold text-gray-900">
                                                            {platform.followers.toLocaleString()} followers
                                                        </p>
                                                    )}
                                                    {platform.engagementRate && (
                                                        <p className="text-sm text-gray-600">
                                                            {platform.engagementRate}% engagement
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No platforms added yet</p>
                                )}
                            </div>
                        )}

                        {/* Portfolio Tab */}
                        {activeTab === 'portfolio' && (
                            <div>
                                {profile.portfolio && profile.portfolio.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {profile.portfolio.map((item, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                                {item.mediaUrl && (
                                                    <div className="aspect-video bg-gray-100">
                                                        {item.mediaType === 'video' ? (
                                                            <video
                                                                src={item.mediaUrl}
                                                                className="w-full h-full object-cover"
                                                                controls
                                                            />
                                                        ) : (
                                                            <img
                                                                src={item.mediaUrl}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                                <div className="p-4">
                                                    {item.title && (
                                                        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                                                    )}
                                                    {item.description && (
                                                        <p className="text-sm text-gray-600">{item.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No portfolio items yet</p>
                                )}
                            </div>
                        )}

                        {/* Resume Tab */}
                        {activeTab === 'resume' && (
                            <div className="space-y-6">
                                {resume ? (
                                    <>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Brands Worked With</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {resume.brandsWorkedWith && resume.brandsWorkedWith.length > 0 ? (
                                                    resume.brandsWorkedWith.map((brand, index) => (
                                                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                                            {brand}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500">No brands yet</p>
                                                )}
                                            </div>
                                        </div>

                                        {resume.agenciesWorkedWith && resume.agenciesWorkedWith.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agencies Worked With</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {resume.agenciesWorkedWith.map((agency, index) => (
                                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                            {agency}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign History</h3>
                                            <div className="space-y-3">
                                                {resume.campaignHistory && resume.campaignHistory.length > 0 ? (
                                                    resume.campaignHistory.map((campaign, index) => (
                                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="font-semibold text-gray-900">{campaign.campaignName}</h4>
                                                                <span className="text-sm text-gray-500">
                                                                    {new Date(campaign.completedAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600">
                                                                Brand: {campaign.brand}
                                                                {campaign.agency && ` • Agency: ${campaign.agency}`}
                                                            </p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500">No campaign history yet</p>
                                                )}
                                            </div>
                                        </div>

                                        {resume.ratings && resume.ratings.total > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ratings</h3>
                                                <div className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="text-center">
                                                            <p className="text-3xl font-bold text-gray-900">
                                                                {resume.ratings.average.toFixed(1)}
                                                            </p>
                                                            <div className="flex items-center justify-center gap-1 mt-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-4 h-4 ${
                                                                            i < Math.round(resume.ratings.average)
                                                                                ? 'text-yellow-400 fill-current'
                                                                                : 'text-gray-300'
                                                                        }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {resume.ratings.total} reviews
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {resume.ratings.breakdown.map((breakdown, index) => (
                                                            <div key={index} className="flex items-center gap-2">
                                                                <span className="text-sm text-gray-600 w-12">
                                                                    {breakdown.star} star
                                                                </span>
                                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                                    <div
                                                                        className="bg-yellow-400 h-2 rounded-full"
                                                                        style={{
                                                                            width: `${(breakdown.count / resume.ratings.total) * 100}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className="text-sm text-gray-600 w-8">
                                                                    {breakdown.count}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                                    <h4 className="font-semibold text-gray-900">On-Time Rate</h4>
                                                </div>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {resume.deliverableStats?.onTimeRate?.toFixed(0) || 0}%
                                                </p>
                                            </div>
                                            <div className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Award className="w-5 h-5 text-purple-600" />
                                                    <h4 className="font-semibold text-gray-900">Avg Revisions</h4>
                                                </div>
                                                <p className="text-2xl font-bold text-purple-600">
                                                    {resume.deliverableStats?.averageRevisionCount?.toFixed(1) || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-gray-500">Resume data not available</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

