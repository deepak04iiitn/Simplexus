import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/features">Features</NavLink>
              <NavLink to="/pricing">Pricing</NavLink>
              <NavLink to="/solutions">Solutions</NavLink>
              <NavLink to="/resources">Resources</NavLink>
              <NavLink to="/about">About</NavLink>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
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

          {/* Mobile Menu */}
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
                  <MobileNavLink to="/features">Features</MobileNavLink>
                  <MobileNavLink to="/pricing">Pricing</MobileNavLink>
                  <MobileNavLink to="/solutions">Solutions</MobileNavLink>
                  <MobileNavLink to="/resources">Resources</MobileNavLink>
                  <MobileNavLink to="/about">About</MobileNavLink>
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

