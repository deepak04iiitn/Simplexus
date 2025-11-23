import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Twitter, Linkedin, Instagram, Youtube, Send, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <footer className="relative bg-gray-900 text-gray-300 overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(139, 92, 246, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139, 92, 246, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        ></div>
        
        {/* Diagonal Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(147, 51, 234, 0.08) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(147, 51, 234, 0.08) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(147, 51, 234, 0.08) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(147, 51, 234, 0.08) 75%)
            `,
            backgroundSize: '120px 120px',
            backgroundPosition: '0 0, 0 60px, 60px -60px, -60px 0px'
          }}
        ></div>
        
        {/* Glowing Accents */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Dot Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        ></div>
        
        {/* Gradient Fade from Top */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/50"></div>
      </div>

      {/* Top accent bar with glow */}
      <div className="relative h-1 bg-purple-600 shadow-lg shadow-purple-500/50"></div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 group mb-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <img 
                  src="/Simplexus.png"
                  alt="Simplexus Logo"
                  className="h-16 w-auto relative z-10"
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">
                  Simplexus
                </span>
                <span className="text-xs text-purple-300 font-medium">Creator Management Platform</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
              Transform your creator campaigns with our all-in-one platform. Streamline briefs, approvals, and deliverables with enterprise-grade tools built for modern teams.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-purple-400" />
                <h3 className="text-white font-bold">
                  Stay in the Loop
                </h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">Get the latest updates, tips, and exclusive content delivered to your inbox.</p>
              <form onSubmit={handleSubscribe} className="relative group">
                <div className="absolute -inset-0.5 bg-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative flex">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="flex-1 px-5 py-3 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder:text-gray-500 transition-all duration-300"
                  />
                  <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-r-xl hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Subscribe</span>
                  </motion.button>
                </div>
              </form>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Connect With Us</h4>
              <div className="flex gap-3">
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
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <span>Product</span>
            </h3>
            <ul className="space-y-3.5">
              <FooterLink to="/features">Features</FooterLink>
              <FooterLink to="/pricing">Pricing</FooterLink>
              <FooterLink to="/integrations">Integrations</FooterLink>
              <FooterLink to="/changelog">Changelog</FooterLink>
              <FooterLink to="/roadmap">Roadmap</FooterLink>
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h3 className="text-white font-bold mb-6">
              Solutions
            </h3>
            <ul className="space-y-3.5">
              <FooterLink to="/for-brands">For Brands</FooterLink>
              <FooterLink to="/for-agencies">For Agencies</FooterLink>
              <FooterLink to="/for-creators">For Creators</FooterLink>
              <FooterLink to="/use-cases">Use Cases</FooterLink>
              <FooterLink to="/case-studies">Case Studies</FooterLink>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-bold mb-6">
              Company
            </h3>
            <ul className="space-y-3.5">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/careers">
                Careers
                <span className="ml-2 px-2 py-0.5 text-xs bg-purple-600 rounded-full">We're hiring!</span>
              </FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/support">Support</FooterLink>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <span>© {currentYear} Simplexus.</span>
              <span className="hidden sm:inline">All rights reserved.</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 hover:underline decoration-purple-400">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 hover:underline decoration-purple-400">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 hover:underline decoration-purple-400">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom bar with glow */}
      <div className="relative h-1 bg-purple-600 shadow-lg shadow-purple-500/50"></div>
    </footer>
  );
}

// Social Icon Component
function SocialIcon({ href, children, ariaLabel }) {
  return (
    <motion.a 
      href={href} 
      aria-label={ariaLabel}
      whileHover={{ scale: 1.1, y: -3 }}
      whileTap={{ scale: 0.95 }}
      className="relative w-11 h-11 flex items-center justify-center bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden"
    >
      {/* Solid overlay on hover */}
      <div className="absolute inset-0 bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <span className="relative z-10 text-gray-400 group-hover:text-white transition-colors duration-300">
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
        className="group flex items-center text-gray-400 hover:text-white transition-all duration-200 gap-2"
      >
        <motion.div
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2"
        >
          <ArrowRight className="w-0 h-4 text-purple-400 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-200" />
          <span className="group-hover:translate-x-1 transition-transform duration-200">{children}</span>
        </motion.div>
      </Link>
    </li>
  );
}

