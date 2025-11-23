import React from 'react';
import { motion } from 'framer-motion';

function ProblemCard({ icon, title, description, color, delay }) {
  const colorConfig = {
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      lightGradient: 'from-purple-50 to-purple-100',
      shadowColor: 'shadow-purple-500/15',
      accentColor: 'bg-purple-500',
      borderGlow: 'group-hover:border-purple-400'
    },
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      lightGradient: 'from-blue-50 to-blue-100',
      shadowColor: 'shadow-blue-500/15',
      accentColor: 'bg-blue-500',
      borderGlow: 'group-hover:border-blue-400'
    },
    emerald: {
      gradient: 'from-emerald-500 to-emerald-600',
      lightGradient: 'from-emerald-50 to-emerald-100',
      shadowColor: 'shadow-emerald-500/15',
      accentColor: 'bg-emerald-500',
      borderGlow: 'group-hover:border-emerald-400'
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      lightGradient: 'from-orange-50 to-orange-100',
      shadowColor: 'shadow-orange-500/15',
      accentColor: 'bg-orange-500',
      borderGlow: 'group-hover:border-orange-400'
    },
    pink: {
      gradient: 'from-pink-500 to-pink-600',
      lightGradient: 'from-pink-50 to-pink-100',
      shadowColor: 'shadow-pink-500/15',
      accentColor: 'bg-pink-500',
      borderGlow: 'group-hover:border-pink-400'
    },
    indigo: {
      gradient: 'from-indigo-500 to-indigo-600',
      lightGradient: 'from-indigo-50 to-indigo-100',
      shadowColor: 'shadow-indigo-500/15',
      accentColor: 'bg-indigo-500',
      borderGlow: 'group-hover:border-indigo-400'
    },
  };

  const config = colorConfig[color];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, type: "spring", stiffness: 100 }}
      className="group relative"
    >
      {/* Premium Card Container */}
      <motion.div
        whileHover={{ y: -12 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`relative h-full bg-white p-10 rounded-3xl border border-slate-200 ${config.borderGlow} transition-all duration-500 shadow-xl ${config.shadowColor} backdrop-blur-sm`}
      >
        
        {/* Content wrapper */}
        <div className="relative z-10">
          {/* Premium Icon container */}
          <div className="mb-8">
            <motion.div 
              whileHover={{ scale: 1.15, rotate: 8 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${config.gradient} rounded-2xl shadow-xl ${config.shadowColor} relative`}
            >
              <div className="text-white relative z-10">
                {icon}
              </div>
            </motion.div>
          </div>

          {/* Premium Typography */}
          <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
            {title}
          </h3>
          <p className="text-slate-600 leading-relaxed text-[15px] font-medium">
            {description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProblemCard;
