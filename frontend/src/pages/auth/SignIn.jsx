import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../../redux/user/userSlice';
import toast from 'react-hot-toast';
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthLayout from '../../components/AuthLayout';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return toast.error('All fields are required!');
    }

    try {
      dispatch(signInStart());
      const res = await fetch('/backend/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success === false || !res.ok) {
        dispatch(signInFailure(data.message));
        return toast.error(data.message || 'Sign in failed!');
      }

      dispatch(signInSuccess(data));
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error('Something went wrong!');
    }
  };

  // Slide-in animation from right
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  return (
    <AuthLayout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 leading-tight tracking-tight">
              Welcome Back
            </h1>
            <div className="h-1.5 w-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            Sign in to continue your journey and manage your creator campaigns.
          </motion.p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-800 mb-2.5 tracking-wide">
                Email Address
              </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="email"
                id="email"
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl
                  focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                  outline-none transition-all duration-200 text-slate-900 placeholder-slate-400
                  hover:border-slate-300"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-bold text-slate-800 tracking-wide">
                Password
              </label>
              <Link 
                to="/forgot-password" 
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl
                  focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                  outline-none transition-all duration-200 text-slate-900 placeholder-slate-400
                  hover:border-slate-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600
                  transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500
                focus:ring-2 cursor-pointer accent-blue-600"
            />
            <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer select-none">
              Remember me for 14 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 
              rounded-xl transition-all duration-200 flex items-center justify-center gap-2
              shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40
              disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-white text-slate-500 font-medium">New to Simplexus?</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <Link
          to="/sign-up"
          className="w-full block text-center bg-slate-50 hover:bg-slate-100 text-slate-700 
            font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 border border-slate-200
            hover:border-slate-300"
        >
          Create Account
        </Link>

        {/* Terms */}
        <p className="text-center text-xs text-slate-500 mt-6">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-semibold">
            Terms
          </Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
