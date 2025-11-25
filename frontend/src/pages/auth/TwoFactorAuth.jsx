// Updated TwoFactorAuth.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Shield, Check, Copy, Download, Smartphone, Key, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../../components/AuthLayout';

export default function TwoFactorAuth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'verify'; // 'setup' or 'verify'
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const navigate = useNavigate();
  const codeInputRefs = useRef([]);

  // Fetch QR code and manual setup code for setup mode
  useEffect(() => {
    if (mode === 'setup') {
      fetchSetupData();
    }
  }, [mode]);

  const fetchSetupData = async () => {
    try {
      const res = await fetch('/backend/auth/2fa/setup', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      
      if (res.ok) {
        setQrCode(data.qrCode);
        setManualCode(data.manualCode);
      }
    } catch (error) {
      toast.error('Failed to load 2FA setup data');
    }
  };

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
      const endpoint = mode === 'setup' ? '/backend/auth/2fa/enable' : '/backend/auth/2fa/verify';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: codeString,
          trustDevice: mode === 'verify' ? trustDevice : undefined
        })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setLoading(false);
        setCode(['', '', '', '', '', '']);
        codeInputRefs.current[0]?.focus();
        return toast.error(data.message || 'Invalid code');
      }

      setLoading(false);
      
      if (mode === 'setup') {
        // Show backup codes
        setBackupCodes(data.backupCodes || []);
        setShowBackupCodes(true);
        toast.success('2FA enabled successfully!');
      } else {
        toast.success('Verification successful!');
        navigate('/');
      }
    } catch (error) {
      setLoading(false);
      toast.error('Something went wrong!');
    }
  };

  const copyManualCode = () => {
    navigator.clipboard.writeText(manualCode);
    toast.success('Code copied to clipboard!');
  };

  const downloadBackupCodes = () => {
    const text = backupCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simplexus-backup-codes.txt';
    a.click();
    toast.success('Backup codes downloaded!');
  };

  const copyBackupCodes = () => {
    const text = backupCodes.join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Backup codes copied to clipboard!');
  };

  const completeSetup = () => {
    setIsSetupComplete(true);
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <AuthLayout authType="2fa">
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
            {mode === 'setup' && !showBackupCodes && (
              <motion.div
                key="setup"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
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
                    Enable 2FA
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-gray-600 text-base"
                  >
                    Add an extra layer of security to your account
                  </motion.p>
                </div>

                {/* QR Code Setup */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* QR Code */}
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-xl mx-auto max-w-xs border border-gray-200 shadow-sm">
                      <img src={qrCode} alt="QR Code" className="w-48 h-48 mx-auto" />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Scan with your authenticator app</p>
                  </div>

                  {/* Manual Setup */}
                  <div className="text-center space-y-3">
                    <p className="text-sm text-gray-600">Or enter this code manually:</p>
                    <div className="bg-gray-100 p-3 rounded-xl inline-flex items-center gap-2">
                      <span className="font-mono font-semibold text-lg">{manualCode}</span>
                      <button
                        onClick={copyManualCode}
                        className="p-1 text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Code Input for Setup */}
                  <div className="flex gap-2 justify-center">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (codeInputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold bg-white border-2 border-gray-200 
                                 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50
                                 outline-none transition-all duration-300 text-gray-900
                                 hover:border-gray-300 hover:bg-gray-50"
                      />
                    ))}
                  </div>

                  {/* Verify Button for Setup */}
                  <motion.button
                    onClick={() => handleVerify()}
                    disabled={loading || code.join('').length !== 6}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400
                             text-white font-semibold rounded-xl transition-all duration-300
                             focus:outline-none focus:ring-4 focus:ring-indigo-100/50
                             disabled:cursor-not-allowed flex items-center justify-center gap-2
                             shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Enabling 2FA...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5" />
                        <span>Enable 2FA</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            {mode === 'setup' && showBackupCodes && !isSetupComplete && (
              <motion.div
                key="backup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="mb-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-green-500 rounded-full 
                             flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20"
                  >
                    <Key className="h-10 w-10 text-white" />
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-3xl font-bold text-gray-900 mb-3"
                  >
                    Save Your Backup Codes
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-gray-600 text-base"
                  >
                    These codes are your backup for when you can't access your authenticator app.
                    <br />
                    Store them securely offline.
                  </motion.p>
                </div>

                {/* Backup Codes */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="font-mono text-lg">{code}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(code);
                            toast.success('Code copied!');
                          }}
                          className="p-1 text-gray-500 hover:text-indigo-600"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 justify-center">
                    <motion.button
                      onClick={copyBackupCodes}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                      Copy All
                    </motion.button>
                    <motion.button
                      onClick={downloadBackupCodes}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </motion.button>
                  </div>
                </div>

                {/* Complete Button */}
                <motion.button
                  onClick={completeSetup}
                  whileHover={{ scale: 1.02 }}
                  className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700
                           text-white font-semibold rounded-xl transition-all duration-300
                           shadow-md hover:shadow-lg mt-6"
                >
                  I've Saved My Codes
                </motion.button>
              </motion.div>
            )}

            {mode === 'setup' && isSetupComplete && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
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
                  2FA Enabled!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Your account is now more secure.
                  <br />
                  Redirecting to dashboard...
                </p>

                <div className="flex items-center justify-center gap-2 text-indigo-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-medium">Please wait...</span>
                </div>
              </motion.div>
            )}

            {mode === 'verify' && (
              <motion.div
                key="verify"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                    <Smartphone className="h-10 w-10 text-white" />
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-4xl font-bold text-gray-900 mb-3"
                  >
                    Two-Factor Authentication
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-gray-600 text-base"
                  >
                    Enter the code from your authenticator app
                  </motion.p>
                </div>

                {/* Code Input */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  <div className="flex gap-2 justify-center">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (codeInputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold bg-white border-2 border-gray-200 
                                 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50
                                 outline-none transition-all duration-300 text-gray-900
                                 hover:border-gray-300 hover:bg-gray-50"
                      />
                    ))}
                  </div>

                  {/* Trust Device */}
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      id="trustDevice"
                      checked={trustDevice}
                      onChange={(e) => setTrustDevice(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 
                               focus:ring-2 cursor-pointer"
                    />
                    <label htmlFor="trustDevice" className="ml-2 text-sm text-gray-600 cursor-pointer">
                      Trust this device for 30 days
                    </label>
                  </div>

                  {/* Use Backup Code Link */}
                  <div className="text-center">
                    <Link
                      to="/2fa-backup"
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                      Use a backup code instead
                    </Link>
                  </div>

                  {/* Verify Button */}
                  <motion.button
                    onClick={() => handleVerify()}
                    disabled={loading || code.join('').length !== 6}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400
                             text-white font-semibold rounded-xl transition-all duration-300
                             focus:outline-none focus:ring-4 focus:ring-indigo-100/50
                             disabled:cursor-not-allowed flex items-center justify-center gap-2
                             shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5" />
                        <span>Verify Code</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Helper Text */}
        {mode === 'verify' && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center text-sm text-gray-600 mt-6"
          >
            Having trouble?{' '}
            <Link to="/support" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Contact Support
            </Link>
          </motion.p>
        )}
      </motion.div>
    </AuthLayout>
  );
}