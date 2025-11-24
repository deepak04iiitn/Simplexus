import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Mail, Lock, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request Reset Code
  const handleRequestReset = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error('Please enter your email address');
    }

    setLoading(true);

    try {
      const res = await fetch('/backend/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return toast.error(data.message || 'Failed to send reset code');
      }

      setLoading(false);
      toast.success('Reset code sent to your email!');
      setStep(2);

    } catch (error) {
      setLoading(false);
      toast.error('Something went wrong!');
    }
  };

  // Step 2: Verify Reset Code
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!code || code.length !== 6) {
      return toast.error('Please enter the 6-digit code');
    }

    setLoading(true);

    try {
      const res = await fetch('/backend/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return toast.error(data.message || 'Invalid code');
      }

      setLoading(false);
      toast.success('Code verified!');
      setStep(3);

    } catch (error) {
      setLoading(false);
      toast.error('Something went wrong!');
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match!');
    }

    setLoading(true);

    try {
      const res = await fetch('/backend/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return toast.error(data.message || 'Failed to reset password');
      }

      setLoading(false);
      toast.success('Password reset successful!');
      setTimeout(() => navigate('/sign-in'), 1500);

    } catch (error) {
      setLoading(false);
      toast.error('Something went wrong!');
    }
  };

  // Resend Code
  const handleResendCode = async () => {
    setLoading(true);

    try {
      const res = await fetch('/backend/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return toast.error(data.message || 'Failed to resend code');
      }

      setLoading(false);
      toast.success('New code sent to your email!');

    } catch (error) {
      setLoading(false);
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Reset Password
          </h2>
          <p className="mt-2 text-gray-400">
            {step === 1 && 'Enter your email to receive a reset code'}
            {step === 2 && 'Enter the 6-digit code sent to your email'}
            {step === 3 && 'Create your new password'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((stepNum) => (
            <div
              key={stepNum}
              className={`h-2 w-16 rounded-full transition-all ${
                stepNum <= step ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleRequestReset} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Code...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Reset Code
                </>
              )}
            </button>

            <div className="text-center">
              <Link to="/sign-in" className="text-purple-500 hover:text-purple-400 font-medium transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: Code Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="mt-8 space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                Verification Code
              </label>
              <p className="text-sm text-gray-500 mb-3">Code sent to {email}</p>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500 text-center text-2xl tracking-widest font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Verify Code
                </>
              )}
            </button>

            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="text-purple-500 hover:text-purple-400 font-medium transition-colors disabled:opacity-50"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                />
              </div>
            </div>

            {newPassword && newPassword.length > 0 && (
              <div className="text-sm">
                <div className={`flex items-center gap-2 ${newPassword.length >= 6 ? 'text-green-500' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-500'}`} />
                  At least 6 characters
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Reset Password
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
