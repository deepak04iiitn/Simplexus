import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Twitter, Linkedin, Instagram, Youtube, Send } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 group mb-4">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Simplexus</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-xs">
              The all-in-one platform for managing influencer campaigns. Streamline briefs, approvals, and deliverables with ease.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Stay Updated</h3>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-purple-600 text-white font-medium rounded-r-lg hover:bg-purple-700 transition-colors duration-300 flex items-center"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <SocialIcon href="#" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </SocialIcon>
              <SocialIcon href="#" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </SocialIcon>
              <SocialIcon href="#" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </SocialIcon>
              <SocialIcon href="#" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </SocialIcon>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <FooterLink to="/features">Features</FooterLink>
              <FooterLink to="/pricing">Pricing</FooterLink>
              <FooterLink to="/integrations">Integrations</FooterLink>
              <FooterLink to="/changelog">Changelog</FooterLink>
              <FooterLink to="/roadmap">Roadmap</FooterLink>
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Solutions</h3>
            <ul className="space-y-3">
              <FooterLink to="/for-brands">For Brands</FooterLink>
              <FooterLink to="/for-agencies">For Agencies</FooterLink>
              <FooterLink to="/for-creators">For Creators</FooterLink>
              <FooterLink to="/use-cases">Use Cases</FooterLink>
              <FooterLink to="/case-studies">Case Studies</FooterLink>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/support">Support</FooterLink>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} Simplexus. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Social Icon Component
function SocialIcon({ href, children, ariaLabel }) {
  return (
    <motion.a 
      href={href} 
      aria-label={ariaLabel}
      whileHover={{ scale: 1.1, y: -2 }}
      className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors duration-300 group"
    >
      <span className="text-gray-400 group-hover:text-white transition-colors">
        {children}
      </span>
    </motion.a>
  );
}

// Footer Link Component
function FooterLink({ to, children }) {
  return (
    <li>
      <Link 
        to={to} 
        className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
      >
        {children}
      </Link>
    </li>
  );
}

