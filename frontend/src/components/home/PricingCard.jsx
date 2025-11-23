import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Star, ArrowRight, Check, Award } from 'lucide-react';

function PricingCard({ tier, monthlyPrice, annualPrice, billingPeriod, description, features, featured, delay }) {
  const isAnnual = billingPeriod === 'annual';
  const displayPrice = isAnnual ? annualPrice : monthlyPrice;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8, scale: featured ? 1.02 : 1.05 }}
      className={`relative p-10 rounded-3xl transition-all duration-300 ${
        featured 
          ? 'bg-purple-600 text-white shadow-2xl scale-105 border-4 border-purple-400' 
          : 'bg-white border-2 border-gray-200 shadow-lg hover:border-purple-300'
      }`}
    >
      {featured && (
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
          <Award className="w-4 h-4 mr-2" />
          Most Popular
        </div>
      )}
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-2 ${featured ? 'text-white' : 'text-gray-900'}`}>{tier}</h3>
        <p className={`mb-8 ${featured ? 'text-purple-100' : 'text-gray-600'}`}>{description}</p>
        
        <div className="mb-8">
          {isAnnual && monthlyPrice > 0 && (
            <div className="mb-2">
              <span className={`text-xl font-bold line-through ${featured ? 'text-purple-200' : 'text-gray-400'}`}>
                ${monthlyPrice * 12}
              </span>
              <span className={`text-sm ml-1 ${featured ? 'text-purple-200' : 'text-gray-400'}`}>/year</span>
            </div>
          )}
          <div>
            <span className={`text-6xl font-bold ${featured ? 'text-white' : 'text-gray-900'}`}>
              ${displayPrice}
            </span>
            <span className={`text-lg ${featured ? 'text-purple-100' : 'text-gray-600'}`}>
              {isAnnual ? '/year' : '/month'}
            </span>
          </div>
          {isAnnual && monthlyPrice > 0 && (
            <div className="mt-2">
              <span className={`text-sm font-semibold ${featured ? 'text-purple-100' : 'text-green-600'}`}>
                ${Math.round(displayPrice / 12)}/month when billed annually
              </span>
            </div>
          )}
        </div>
        
        <ul className="space-y-4 mb-10">
          {features.map((feature, idx) => (
            <li key={idx} className={`flex items-center text-left ${featured ? 'text-white' : 'text-gray-700'}`}>
              <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${featured ? 'text-white' : 'text-green-500'}`} />
              <span className="font-medium">{feature}</span>
            </li>
          ))}
        </ul>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            to="/sign-up" 
            className={`block w-full py-4 rounded-xl font-bold transition-all duration-300 text-lg ${
              featured 
                ? 'bg-white text-purple-600 hover:bg-gray-50 shadow-xl' 
                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
            }`}
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default PricingCard;
