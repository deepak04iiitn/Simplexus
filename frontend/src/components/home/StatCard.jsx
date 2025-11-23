import React from 'react';
import { motion } from 'framer-motion';

function StatCard({ icon, value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center transition-all duration-300"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4 text-purple-600">
        {React.cloneElement(icon, { className: 'w-8 h-8' })}
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="text-gray-600 font-medium">{label}</div>
    </motion.div>
  );
}

export default StatCard;
