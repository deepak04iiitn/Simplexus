// Updated EmailVerification.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Mail, Check, Clock, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../../components/AuthLayout';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  
  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const codeInputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle code input
  const handleCodeChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);
      
      // Focus last filled input or next empty
      const nextIndex = Math.min(index + pastedCode.length, 5);
      codeInputRefs.current[nextIndex]?.focus();
      
      // Auto-submit if all filled
      if (newCode.every(digit => digit !== '')) {
        handleVerify(newCode.join(''));
      }
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-advance to next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all filled
    if (index === 5 && value && newCode.every(digit => digit !== '')) {
      handleVerify(newCode.join(''));
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (codeString = code.join('')) => {
    if (codeString.length !== 6) {
      return toast.error('Please enter the 6-digit code');
    }

    setLoading(true);
    try {
      const res = await fetch('/backend/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeString })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setLoading(false);
        // Clear code on error
        setCode(['', '', '', '', '', '']);
        codeInputRefs.current[0]?.focus();
        return toast.error(data.message || 'Invalid verification code');
      }

      setLoading(false);
      setIsVerified(true);
      toast.success('Email verified successfully!');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast.error('Something went wrong!');
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    try {
      const res = await fetch('/backend/auth/resend-verification', {
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
      toast.success('New verification code sent!');
      setResendCooldown(60);
      setCode(['', '', '', '', '', '']);
      codeInputRefs.current[0]?.focus();
    } catch (error) {
      setLoading(false);
      toast.error('Something went wrong!');
    }
  };

  return (
    <AuthLayout authType="verify">
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
            {!isVerified ? (
              <motion.div
                key="verify"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="mb-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-emerald-500 rounded-full 
                             flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20"
                  >
                    <Mail className="h-10 w-10 text-white" />
                  </motion.div>
                  <motion.h1 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-4xl font-bold text-gray-900 mb-3"
                  >
                    Verify Email
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-gray-600 text-base"
                  >
                    Enter the 6-digit code sent to {email || 'your email'}
                  </motion.p>
                </div>

                {/* Code Input */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className="flex gap-2 justify-center">
                    {code.map((digit, index) => (
                      <motion.input
                        key={index}
                        ref={(el) => (codeInputRefs.current[index] = el)}
                        type="text"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className="w-12 h-14 text-center text-2xl font-bold bg-white border-2 border-gray-200 
                                 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/50
                                 outline-none transition-all duration-300 text-gray-900
                                 hover:border-gray-300 hover:bg-gray-50"
                      />
                    ))}
                  </div>

                  {/* Resend Button */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={loading || resendCooldown > 0}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors
                               disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                      {resendCooldown > 0 ? (
                        <>
                          <Clock className="h-4 w-4" />
                          <span>Resend code in {resendCooldown}s</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          <span>Resend Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Change Email Link */}
                  <div className="text-center text-sm text-gray-600">
                    Wrong email?{' '}
                    <Link to="/sign-up" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                      Update Email
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-center py-8"
              >
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-green-500 rounded-full 
                           flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20"
                >
                  <Check className="h-12 w-12 text-white" strokeWidth={3} />
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-gray-900 mb-3"
                >
                  Email Verified!
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 mb-6"
                >
                  Your email has been successfully verified.
                  <br />
                  Redirecting to dashboard...
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 text-indigo-600"
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-medium">Please wait...</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Helper Text */}
        {!isVerified && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center text-sm text-gray-600 mt-6"
          >
            Need help?{' '}
            <Link to="/support" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Contact Support
            </Link>
          </motion.p>
        )}
      </motion.div>
    </AuthLayout>
  );
}