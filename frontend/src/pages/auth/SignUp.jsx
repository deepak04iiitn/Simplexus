import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signUpStart, signUpSuccess, signUpFailure } from '../../redux/user/userSlice';
import toast from 'react-hot-toast';
import { Loader2, Mail, Lock, User, Building2, Target, Sparkles, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthLayout from '../../components/AuthLayout';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userType: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value.trim();
    setFormData({
      ...formData,
      [e.target.id]: value
    });

    if (e.target.id === 'password') {
      calculatePasswordStrength(value);
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

  const handleUserTypeChange = (type) => {
    setFormData({
      ...formData,
      userType: type
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      dispatch(signUpFailure(error.message));
      toast.error('Something went wrong!');
    }
  };

  const userTypes = [
    { type: 'Brand', icon: Building2, color: 'blue' },
    { type: 'Agency', icon: Target, color: 'violet' },
    { type: 'Creator', icon: Sparkles, color: 'emerald' }
  ];

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-red-500';
    if (passwordStrength === 1) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getPasswordStrengthWidth = () => {
    return `${(passwordStrength / 3) * 100}%`;
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
        className="w-full"
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
              Get Started
            </h1>
            <div className="h-1.5 w-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            Create your account to start collaborating with creators, brands, and agencies worldwide.
          </motion.p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-slate-800 mb-2.5 tracking-wide">
              Username
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="text"
                id="username"
                onChange={handleChange}
                placeholder="johndoe"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl
                  focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                  outline-none transition-all duration-200 text-slate-900 placeholder-slate-400"
                required
              />
            </div>
          </div>

          {/* Email */}
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
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl
                  focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                  outline-none transition-all duration-200 text-slate-900 placeholder-slate-400"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-slate-800 mb-2.5 tracking-wide">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl
                  focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                  outline-none transition-all duration-200 text-slate-900 placeholder-slate-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Strength */}
            {formData.password && (
              <div className="mt-2">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: getPasswordStrengthWidth() }}
                    className={`h-full ${getPasswordStrengthColor()}`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* User Type */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-4 tracking-wide">
              I am a... <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {userTypes.map((item) => {
                const Icon = item.icon;
                const isSelected = formData.userType === item.type;
                
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleUserTypeChange(item.type)}
                    className={`relative p-3 rounded-xl border-2 transition-all text-center
                      ${isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                    <Icon size={24} className={`mx-auto mb-1 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    <p className={`text-xs font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                      {item.type}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 
              rounded-xl transition-all duration-200 flex items-center justify-center gap-2
              shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40
              disabled:opacity-70 disabled:cursor-not-allowed group mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-sm text-slate-600 mt-5">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign In
          </Link>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-slate-500 mt-4">
          By signing up, you agree to our{' '}
          <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-semibold">Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold">Privacy</Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
