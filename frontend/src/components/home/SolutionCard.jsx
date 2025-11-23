import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

function SolutionCard({ icon, title, description, features, color, delay }) {
  const colorClasses = {
    purple: 'bg-purple-50 border-purple-200 text-purple-600 hover:border-purple-400',
    blue: 'bg-blue-50 border-blue-200 text-blue-600 hover:border-blue-400',
    green: 'bg-green-50 border-green-200 text-green-600 hover:border-green-400',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl border-2 border-gray-100 transition-all duration-300"
    >
      <div className={`inline-flex items-center justify-center w-20 h-20 ${colorClasses[color]} rounded-2xl mb-6 border-2`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center text-gray-700 font-medium">
            <Check className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default SolutionCard;
