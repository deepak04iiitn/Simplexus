import React from 'react';
import { motion } from 'framer-motion';

function ProblemCard({ icon, title, description, color, delay, metaLeft, metaRight }) {
  const colorConfig = {
    purple: {
      accentDot: 'bg-purple-500',
      accentBorder: 'border-purple-100',
      badge: 'bg-purple-50 text-purple-700 border-purple-100',
    },
    blue: {
      accentDot: 'bg-blue-500',
      accentBorder: 'border-blue-100',
      badge: 'bg-blue-50 text-blue-700 border-blue-100',
    },
    emerald: {
      accentDot: 'bg-emerald-500',
      accentBorder: 'border-emerald-100',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    orange: {
      accentDot: 'bg-orange-500',
      accentBorder: 'border-orange-100',
      badge: 'bg-orange-50 text-orange-700 border-orange-100',
    },
    pink: {
      accentDot: 'bg-pink-500',
      accentBorder: 'border-pink-100',
      badge: 'bg-pink-50 text-pink-700 border-pink-100',
    },
    indigo: {
      accentDot: 'bg-indigo-500',
      accentBorder: 'border-indigo-100',
    },
  };

  const config = colorConfig[color];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, type: "spring", stiffness: 110 }}
      className="group relative"
    >
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className={`relative h-full bg-white p-7 rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-lg/40 transition-all duration-300 ${config.accentBorder}`}
      >
        <div className="absolute inset-0 rounded-2xl bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-5">
          {/* Top accent row */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex h-2 w-2 rounded-full ${config.accentDot}`} />
            <span className="h-px w-16 rounded-full bg-slate-200" />
          </div>

          {/* Icon + title row */}
          <div className="flex items-start gap-4">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 overflow-hidden shadow-sm">
              <span className="pointer-events-none absolute inset-0 bg-slate-100/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="text-[19px] leading-none">
                {icon}
              </span>
            </div>

            <h3 className="text-base md:text-lg font-semibold text-slate-900 tracking-tight leading-snug">
              {title}
            </h3>
          </div>

          <p className="text-slate-600 leading-relaxed text-[13px] md:text-[14px] font-medium">
            {description}
          </p>

          {/* Subtle bottom meta row */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              <span>{metaLeft || 'Operational friction'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              <span>{metaRight || 'Simplexus impact'}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProblemCard;
