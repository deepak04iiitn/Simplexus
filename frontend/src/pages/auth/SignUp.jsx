import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signUpStart, signUpSuccess, signUpFailure } from '../../redux/user/userSlice';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userType: ''
  });

  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    });
  };

  const handleUserTypeChange = (type) => {
    setFormData({
      ...formData,
      userType: type
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.userType) {
      return toast.error('All fields are required!');
    }

    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters!');
    }

    try {
      dispatch(signUpStart());

      const res = await fetch('/backend/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(signUpFailure(data.message));
        return toast.error(data.message || 'Signup failed!');
      }

      dispatch(signUpSuccess(data));
      toast.success('Account created successfully! Welcome to Simplexus.');
      navigate('/');

    } catch (error) {
      dispatch(signUpFailure(error.message));
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-gray-400">Join Simplexus and start collaborating</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password (min 6 characters)"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
            />
          </div>

          {/* User Type Selection - MANDATORY */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Account Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Brand Option */}
              <button
                type="button"
                onClick={() => handleUserTypeChange('Brand')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.userType === 'Brand'
                    ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                    : 'border-gray-700 bg-gray-800/50 hover:border-purple-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🏢</div>
                  <div className="text-sm font-medium text-white">Brand</div>
                </div>
              </button>

              {/* Agency Option */}
              <button
                type="button"
                onClick={() => handleUserTypeChange('Agency')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.userType === 'Agency'
                    ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                    : 'border-gray-700 bg-gray-800/50 hover:border-blue-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm font-medium text-white">Agency</div>
                </div>
              </button>

              {/* Creator Option */}
              <button
                type="button"
                onClick={() => handleUserTypeChange('Creator')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.userType === 'Creator'
                    ? 'border-pink-500 bg-pink-500/20 shadow-lg shadow-pink-500/20'
                    : 'border-gray-700 bg-gray-800/50 hover:border-pink-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <div className="text-sm font-medium text-white">Creator</div>
                </div>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Sign In Link */}
          <div className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-purple-500 hover:text-purple-400 font-medium transition-colors">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
