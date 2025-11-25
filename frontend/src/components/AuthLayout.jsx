import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layout, Eye, Clock, FileCheck, Users, CheckCircle2
} from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center p-4 py-8 mt-24 mb-16">
      {/* Main Container Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden flex"
      >
        {/* Left Decorative Panel */}
        <div 
          className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden"
        >
          {/* Faded Logo Background */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/Simplexus.png')`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.2,
              filter: 'blur(1px)'
            }}
          ></div>
          
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/75 via-slate-800/65 to-slate-900/75"></div>
          
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
          
          {/* Top Section - Logo & Brand */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                <img 
                  src="/Simplexus.png" 
                  alt="Simplexus Logo" 
                  className="w-full h-full object-contain p-1.5"
                />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">Simplexus</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                Streamline Your<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
                  Creator Campaigns
                </span>
              </h2>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-purple-300 text-sm font-semibold italic">
                  Simplifying the nexus of collaboration
                </span>
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-slate-300 text-base leading-relaxed mb-8"
            >
              The most affordable all-in-one platform for managing creator collaborations. From interactive briefs to automated reporting.
            </motion.p>
          </div>

          {/* Middle Section - Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative z-10"
          >
            {/* Features We Offer */}
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-2 mb-5"
              >
                <CheckCircle2 className="text-emerald-400" size={20} />
                <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Powerful Features</h3>
              </motion.div>
              <div className="space-y-3.5">
                {[
                  { icon: Layout, text: 'Interactive Brief Builder' },
                  { icon: Eye, text: 'Content Review & Approval' },
                  { icon: Clock, text: 'Deliverable Tracking' },
                  { icon: FileCheck, text: 'One-Click Report Generation' },
                  { icon: Users, text: 'Team Collaboration' }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/25 to-purple-500/25 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 border border-white/15 group-hover:border-white/40 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-indigo-500/10">
                      <feature.icon className="text-white" size={18} />
                    </div>
                    <span className="text-white/95 text-sm font-semibold group-hover:text-white transition-colors">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Panel - Form Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
          {/* Faded Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to right, #000 1px, transparent 1px),
                linear-gradient(to bottom, #000 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px'
            }}
          ></div>
          
          <div className="w-full max-w-md py-4 relative z-10">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
