import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import toast from 'react-hot-toast';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/backend/auth/signout', {
        method: 'POST',
      });
      const data = await res.json();
      
      if (data.success === false) {
        toast.error(data.message);
        return;
      }
      
      dispatch(signoutSuccess());
      toast.success('Signed out successfully!');
      navigate('/');
      setIsProfileDropdownOpen(false);
    } catch (error) {
      toast.error('Failed to sign out!');
    }
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' 
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <img 
                  src="/Simplexus.png"
                  alt="Simplexus Logo"
                  className="h-18 w-auto relative z-10"
                />
              </motion.div>
              <span 
                className="text-2xl font-bold text-gray-900 tracking-tight"
                style={{ 
                  fontFamily: "'Outfit', 'Inter', sans-serif",
                }}
              >
                Simplexus
              </span>
            </Link>

            {/* Desktop Navigation - linked to Home sections */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/#features">Features</NavLink>
              <NavLink to="/#pricing">Pricing</NavLink>
              <NavLink to="/#solutions">Solutions</NavLink>
              <NavLink to="/#demo">Demo</NavLink>
              <NavLink to="/#how-it-works">About</NavLink>
            </div>

            {/* CTA Buttons / User Profile */}
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                // User Profile Dropdown
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {currentUser.profilePicture ? (
                        <img
                          src={currentUser.profilePicture}
                          alt={currentUser.username || 'User avatar'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        currentUser.username?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{currentUser.username}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
                      >
                        <div className="p-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{currentUser.username}</p>
                          <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                          <p className="text-xs text-purple-600 font-medium mt-1">{currentUser.userType}</p>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              navigate('/profile');
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </button>
                          <button
                            onClick={handleSignout}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Sign In / Sign Up Buttons
                <>
                  <Link 
                    to="/sign-in" 
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      to="/sign-up" 
                      className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Start Free Trial
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu - linked to Home sections */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden bg-white border-t border-gray-100"
              >
                <div className="py-4 space-y-1">
                  <MobileNavLink to="/#features">Features</MobileNavLink>
                  <MobileNavLink to="/#pricing">Pricing</MobileNavLink>
                  <MobileNavLink to="/#solutions">Solutions</MobileNavLink>
                  <MobileNavLink to="/#demo">Demo</MobileNavLink>
                  <MobileNavLink to="/#how-it-works">About</MobileNavLink>
                  
                  {currentUser ? (
                    // Mobile User Profile Section
                    <div className="pt-4 px-4 space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                            {currentUser.profilePicture ? (
                              <img
                                src={currentUser.profilePicture}
                                alt={currentUser.username || 'User avatar'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              currentUser.username?.charAt(0).toUpperCase() || 'U'
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{currentUser.username}</p>
                            <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                          </div>
                        </div>
                        <p className="text-xs text-purple-600 font-medium">{currentUser.userType}</p>
                      </div>
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            navigate('/profile');
                          }}
                          className="w-full px-4 py-2 text-center text-gray-600 font-medium hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                        <button
                          onClick={handleSignout}
                          className="w-full mt-2 px-4 py-2 text-center text-gray-600 font-medium hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                    </div>
                  ) : (
                    // Mobile Sign In / Sign Up
                    <div className="pt-4 px-4 space-y-3">
                      <Link 
                        to="/sign-in" 
                        className="block w-full px-4 py-2 text-center text-gray-600 font-medium hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link 
                        to="/sign-up" 
                        className="block w-full px-4 py-2 text-center bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Start Free Trial
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>
    </>
  );
}

// Desktop NavLink Component
function NavLink({ to, children }) {
  return (
    <Link 
      to={to} 
      className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
    >
      {children}
    </Link>
  );
}

// Mobile NavLink Component
function MobileNavLink({ to, children }) {
  return (
    <Link 
      to={to} 
      className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors"
    >
      {children}
    </Link>
  );
}
