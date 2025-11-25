// Updated ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Lock, Check, Eye, EyeOff, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../../components/AuthLayout';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const res = await fetch('/backend/auth/validate-reset-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      setTokenValid(res.ok);
      if (!res.ok) {
        toast.error('Invalid or expired reset link');
      }
    } catch (error) {
      setTokenValid(false);
      toast.error('Failed to validate reset link');
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    setPasswordStrength(Math.min(strength, 3));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    calculatePasswordStrength(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match!');
    }

    setLoading(true);
    try {
      const res = await fetch('/backend/auth/reset-password-with-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setLoading(false);
        return toast.error(data.message || 'Failed to reset password');
      }

      setLoading(false);
      setIsSuccess(true);
      toast.success('Password reset successful!');
      setTimeout(() => navigate('/sign-in'), 2500);
    } catch (error) {
      setLoading(false);
      toast.error('Something went wrong!');
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-red-500';
    if (passwordStrength === 1) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return 'Weak';
    if (passwordStrength === 1) return 'Medium';
    return 'Strong';
  };

  const passwordRequirements = [
    { text: 'At least 6 characters', met: newPassword.length >= 6 },
    { text: 'Contains uppercase & lowercase', met: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) },
    { text: 'Contains a number', met: /\d/.test(newPassword) },
    { text: 'Contains a special character', met: /[^a-zA-Z\d]/.test(newPassword) }
  ];

  if (tokenValid === null) {
    return (
      <AuthLayout authType="reset">
        <div className="w-full max-w-lg mx-auto text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout authType="reset">
      <motion.div
        initial={{ opacity: 0, x: 100 }} // Slide from right
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }} // Slide to left on exit
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg mx-auto"
      >
        {/* Clean Card Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10 border border-gray-100">
          <AnimatePresence mode="wait">
            {tokenValid === false && (
              <motion.div
                key="invalid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-red-500 rounded-full 
                           flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20"
                >
                  <AlertCircle className="h-10 w-10 text-white" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Invalid Link
                </h2>
                
                <p className="text-gray-600 mb-6">
                  This password reset link is invalid or has expired.
                </p>

                <Link
                  to="/forgot-password"
                  className="inline-block py-3 px-6 bg-indigo-600 hover:bg-indigo-700
                           text-white font-semibold rounded-xl transition-all duration-300
                           shadow-md hover:shadow-lg"
                >
                  Request New Link
                </Link>
              </motion.div>
            )}

            {tokenValid && !isSuccess && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="mb-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-indigo-500 rounded-full 
                             flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20"
                  >
                    <Shield className="h-10 w-10 text-white" />
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-4xl font-bold text-gray-900 mb-3"
                  >
                    Reset Password
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-gray-600 text-base"
                  >
                    Create a new password for your account
                  </motion.p>
                </div>

                <motion.form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label 
                      htmlFor="newPassword" 
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      New Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 
                                     group-focus-within:text-indigo-600 transition-all duration-300 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Min. 6 characters"
                        className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-xl 
                                 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50
                                 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400
                                 hover:border-gray-300 hover:bg-gray-50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 
                                 transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    {/* Password Strength */}
                    {newPassword && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${getPasswordStrengthColor()}`} />
                          <span className="font-medium capitalize">{getPasswordStrengthText()}</span>
                        </div>
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(passwordStrength * 33, 100)}%` }}
                            className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label 
                      htmlFor="confirmPassword" 
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 
                                     group-focus-within:text-indigo-600 transition-all duration-300 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-xl 
                                 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50
                                 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400
                                 hover:border-gray-300 hover:bg-gray-50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 
                                 transition-colors focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  {newPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-gray-50 rounded-xl p-4 space-y-2"
                    >
                      {passwordRequirements.map((req, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center gap-2 text-sm ${
                            req.met ? 'text-green-600' : 'text-gray-500'
                          }`}
                        >
                          {req.met ? (
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                          )}
                          <span>{req.text}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Password Match Indicator */}
                  {newPassword && confirmPassword && (
                    <div className={`flex items-center gap-2 text-sm ${
                      newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        newPassword === confirmPassword ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium">
                        {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                      </span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400
                             text-white font-semibold rounded-xl transition-all duration-300
                             focus:outline-none focus:ring-4 focus:ring-indigo-100/50
                             disabled:cursor-not-allowed flex items-center justify-center gap-2
                             shadow-md hover:shadow-lg
                             mt-6"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Resetting Password...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5" />
                        <span>Reset Password</span>
                      </>
                    )}
                  </motion.button>
                </motion.form>
              </motion.div>
            )}

            {isSuccess && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-green-500 rounded-full 
                           flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20"
                >
                  <Check className="h-12 w-12 text-white" strokeWidth={3} />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Password Reset!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Your password has been successfully reset.
                  <br />
                  Redirecting to sign in...
                </p>

                <div className="flex items-center justify-center gap-2 text-indigo-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-medium">Please wait...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Helper Text */}
        {tokenValid && !isSuccess && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center text-sm text-gray-600 mt-6"
          >
            Remember your password?{' '}
            <Link to="/sign-in" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Sign In
            </Link>
          </motion.p>
        )}
      </motion.div>
    </AuthLayout>
  );
}