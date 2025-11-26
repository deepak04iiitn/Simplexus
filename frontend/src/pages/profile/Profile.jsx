import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../../redux/user/userSlice';
import { Loader2, Camera, Mail, User as UserIcon, Trash2, Shield, Calendar, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profilePicture: '',
  });
  const [previewImage, setPreviewImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }

    setFormData({
      username: currentUser.username || '',
      email: currentUser.email || '',
      profilePicture: currentUser.profilePicture || '',
    });
    setPreviewImage(currentUser.profilePicture || '');
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreviewImage(base64String);
      setFormData((prev) => ({ ...prev, profilePicture: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!formData.username || !formData.email) {
      return toast.error('Username and email are required.');
    }

    try {
      dispatch(updateStart());
      setSaving(true);

      const res = await fetch(`/backend/user/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(updateFailure(data.message || 'Failed to update profile.'));
        setSaving(false);
        return toast.error(data.message || 'Failed to update profile.');
      }

      dispatch(updateSuccess(data));
      setSaving(false);
      toast.success('Profile updated successfully.');
    } catch (error) {
      dispatch(updateFailure(error.message));
      setSaving(false);
      toast.error('Something went wrong while updating profile.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      dispatch(deleteUserStart());
      setDeleting(true);

      const res = await fetch(`/backend/user/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(deleteUserFailure(data.message || 'Failed to delete account.'));
        setDeleting(false);
        return toast.error(data.message || 'Failed to delete account.');
      }

      dispatch(deleteUserSuccess());
      dispatch(signoutSuccess());
      setDeleting(false);
      toast.success('Account deleted successfully.');
      navigate('/');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      setDeleting(false);
      toast.error('Something went wrong while deleting account.');
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-2">
                <UserIcon className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                  Profile & Account
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Personal Hub</span>
                <span className="hidden sm:inline text-indigo-500">·</span>
                <span className="text-indigo-600">Profile Settings</span>
              </h1>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl">
                Keep your Simplexus identity up to date, manage how you appear to teams, and control
                critical account preferences in one place.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Security-first profile management</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white border-2 border-indigo-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-100 shadow-md ring-4 ring-indigo-50">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                        <UserIcon className="w-16 h-16 text-indigo-400" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:scale-110"
                  >
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                <div className="mt-6 text-center w-full">
                  <h2 className="text-xl font-semibold text-slate-900">{currentUser.username}</h2>
                  <p className="text-sm text-slate-500 mt-1 flex items-center justify-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-500" />
                    {currentUser.email}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-indigo-100 w-full">
                  <div className="flex items-center text-xs text-slate-500 justify-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>
                      Joined{' '}
                      {currentUser.createdAt
                        ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Simplexus'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info Card */}
            <div className="bg-white border-2 border-purple-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="text-sm font-semibold text-purple-700 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Account Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between py-2">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Workspace</p>
                    <p className="text-sm text-slate-900 mt-1 font-medium flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-slate-700">{currentUser.userType}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start justify-between py-2 border-t border-purple-100">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Role</p>
                    <p className="text-sm text-slate-900 mt-1 font-medium">
                      {currentUser.isUserAdmin ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-600 text-white">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Standard User
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Edit Form & Danger Zone */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile Form */}
            <div className="bg-white border-2 border-blue-100 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="mb-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-blue-600" />
                      Personal Information
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Update your core details and how your profile is presented across Simplexus.
                    </p>
                  </div>
                  
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <UserIcon className="h-4 w-4 text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none hover:border-indigo-300"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-emerald-500" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 outline-none hover:border-emerald-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-6 py-2.5 border-2 border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-white border-2 border-red-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Danger Zone
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  Once you delete your account, there is no going back. All your data will be permanently removed.
                </p>
              </div>

              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="inline-flex items-center px-6 py-2.5 border-2 border-red-400 text-sm font-semibold rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-red-500 hover:scale-105"
              >
                {deleting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Deleting Account...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
