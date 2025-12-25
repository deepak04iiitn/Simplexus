import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Instagram, Youtube, Star, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreatorSearch() {
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        location: '',
        niche: '',
        platform: '',
        minFollowers: '',
        maxFollowers: '',
    });

    useEffect(() => {
        searchCreators();
    }, []);

    const searchCreators = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.location) queryParams.append('location', filters.location);
            if (filters.niche) queryParams.append('niche', filters.niche);
            if (filters.platform) queryParams.append('platform', filters.platform);
            if (filters.minFollowers) queryParams.append('minFollowers', filters.minFollowers);
            if (filters.maxFollowers) queryParams.append('maxFollowers', filters.maxFollowers);

            const res = await fetch(`/backend/creator-profiles/search/creators?${queryParams}`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setCreators(data.profiles || []);
            } else {
                toast.error(data.message || 'Failed to search creators');
            }
        } catch (error) {
            toast.error('Failed to search creators');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        searchCreators();
    };

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

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Creators</h1>
                    
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="City, State"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Niche
                                </label>
                                <input
                                    type="text"
                                    value={filters.niche}
                                    onChange={(e) => handleFilterChange('niche', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="e.g., Food, Travel, Fashion"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Platform
                                </label>
                                <select
                                    value={filters.platform}
                                    onChange={(e) => handleFilterChange('platform', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">All Platforms</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="TikTok">TikTok</option>
                                    <option value="YouTube">YouTube</option>
                                    <option value="Twitter">Twitter</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Facebook">Facebook</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Min Followers
                                </label>
                                <input
                                    type="number"
                                    value={filters.minFollowers}
                                    onChange={(e) => handleFilterChange('minFollowers', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Followers
                                </label>
                                <input
                                    type="number"
                                    value={filters.maxFollowers}
                                    onChange={(e) => handleFilterChange('maxFollowers', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="1000000"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full md:w-auto bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            Search Creators
                        </button>
                    </form>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading creators...</div>
                ) : creators.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">No creators found</p>
                        <p className="text-sm text-gray-400">Try adjusting your search filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {creators.map((profile) => (
                            <Link
                                key={profile._id}
                                to={profile.profileSlug ? `/creators/slug/${profile.profileSlug}` : `/creators/${profile.userId._id}`}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={profile.userId.profilePicture}
                                        alt={profile.userId.username}
                                        className="w-16 h-16 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{profile.userId.username}</h3>
                                        {profile.location && (
                                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>
                                                    {profile.location.city && `${profile.location.city}, `}
                                                    {profile.location.country}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {profile.niche && profile.niche.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {profile.niche.slice(0, 3).map((n, i) => (
                                            <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                                {n}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {profile.platforms && profile.platforms.length > 0 && (
                                    <div className="space-y-2">
                                        {profile.platforms.slice(0, 2).map((platform, i) => (
                                            <div key={i} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    {platform.platform === 'Instagram' && <Instagram className="w-4 h-4 text-pink-600" />}
                                                    {platform.platform === 'YouTube' && <Youtube className="w-4 h-4 text-red-600" />}
                                                    <span className="text-gray-700">{platform.platform}</span>
                                                </div>
                                                {platform.followers && (
                                                    <span className="text-gray-600">
                                                        {platform.followers.toLocaleString()} followers
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {profile.stats && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
                                        <span className="text-gray-600">On-Time Rate</span>
                                        <span className="font-semibold text-green-600">
                                            {profile.stats.onTimeRate?.toFixed(0) || 0}%
                                        </span>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

