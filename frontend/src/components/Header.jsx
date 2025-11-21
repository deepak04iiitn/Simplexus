import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200' 
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <img 
                src="/Logo_of_Simplexus.png"
                alt="Simplexus Logo"
                className="h-14 w-auto drop-shadow-lg"
              />
            </motion.div>
            <motion.span 
              className="text-4xl font-semibold text-purple-700"
              style={{ 
                fontFamily: "'Outfit', 'Space Grotesk', 'Raleway', sans-serif",
                letterSpacing: '0.05em',
                fontWeight: 600,
                textShadow: '0 2px 4px rgba(126, 34, 206, 0.1)'
              }}
              whileHover={{ 
                scale: 1.02,
                textShadow: '0 4px 8px rgba(126, 34, 206, 0.15)'
              }}
              transition={{ duration: 0.2 }}
            >
              Simplexus
            </motion.span>
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
              className="px-5 py-2.5 text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              Sign In
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/sign-up" 
                className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-md"
              >
                Start Free Trial
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-100 overflow-hidden"
            >
              <div className="flex flex-col space-y-3">
                <MobileNavLink to="/features">Features</MobileNavLink>
                <MobileNavLink to="/pricing">Pricing</MobileNavLink>
                <MobileNavLink to="/solutions">Solutions</MobileNavLink>
                <MobileNavLink to="/resources">Resources</MobileNavLink>
                <MobileNavLink to="/about">About</MobileNavLink>
                <div className="pt-3 space-y-2">
                  <Link 
                    to="/sign-in" 
                    className="block px-4 py-2 text-center text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/sign-up" 
                    className="block px-4 py-2 text-center bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
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
  );
}

// Desktop NavLink Component
function NavLink({ to, children }) {
  return (
    <Link 
      to={to} 
      className="relative text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
    </Link>
  );
}

// Mobile NavLink Component
function MobileNavLink({ to, children }) {
  return (
    <Link 
      to={to} 
      className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-purple-600 rounded-lg transition-colors duration-200"
    >
      {children}
    </Link>
  );
}

