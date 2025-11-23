import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Star, ArrowRight } from 'lucide-react';
import PricingCard from './PricingCard';

function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [userType, setUserType] = useState('brand'); // 'brand' or 'creator'
  
  const brandPricingPlans = [
    {
      tier: "Starter",
      monthlyPrice: 29,
      annualPrice: 290, // ~17% discount (vs $348 if paid monthly)
      description: "Perfect for small brands",
      features: ['5 Active Campaigns', '10 Creators Included', 'Basic Reports', 'Email Support']
    },
    {
      tier: "Growth",
      monthlyPrice: 99,
      annualPrice: 950, // ~20% discount (vs $1,188 if paid monthly)
      description: "For scaling brands & agencies",
      features: ['Unlimited Campaigns', '40 Creators Included', 'Advanced Workflows', 'Team Access (3)'],
      featured: true
    },
    {
      tier: "Agency Pro",
      monthlyPrice: 199,
      annualPrice: 1910, // ~20% discount (vs $2,388 if paid monthly)
      description: "For large agencies",
      features: ['Everything in Growth', '100 Creators Included', 'White-label Reports', 'Team Access (10)']
    }
  ];

  const creatorPricingPlans = [
    {
      tier: "Free",
      monthlyPrice: 0,
      annualPrice: 0,
      description: "Start your journey",
      features: ['Receive campaign briefs', 'Submit content for review', 'Track your deliverables', 'Basic portfolio']
    },
    {
      tier: "Pro Creator",
      monthlyPrice: 15,
      annualPrice: 144, // 20% discount (vs $180 if paid monthly)
      description: "For serious creators",
      features: ['Everything in Free', 'Premium portfolio page', 'Analytics dashboard', 'Priority support'],
      featured: true
    },
    {
      tier: "Creator Studio",
      monthlyPrice: 29,
      annualPrice: 280, // ~20% discount (vs $348 if paid monthly)
      description: "For creator agencies",
      features: ['Everything in Pro', 'Team collaboration', 'Advanced analytics', 'API access']
    }
  ];

  const activePlans = userType === 'brand' ? brandPricingPlans : creatorPricingPlans;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            Affordable Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            The Most <span className="text-purple-600">Affordable</span> Solution
          </h2>
          <p className="text-xl text-gray-600 mb-8">Enterprise features at startup-friendly prices. Start free, scale as you grow.</p>
          
          {/* User Type Toggle */}
          <div className="inline-flex items-center gap-4 bg-gray-100 p-2 rounded-2xl mb-6">
            <button
              onClick={() => setUserType('brand')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                userType === 'brand'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="w-4 h-4 inline-block mr-2" />
              Brand/Agency
            </button>
            <button
              onClick={() => setUserType('creator')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                userType === 'creator'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Star className="w-4 h-4 inline-block mr-2" />
              Creator
            </button>
          </div>

          {/* Billing Period Toggle */}
          <div className="inline-flex items-center gap-4 bg-gray-100 p-2 rounded-2xl">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                billingPeriod === 'annual'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {activePlans.map((plan, idx) => (
            <PricingCard
              key={idx}
              tier={plan.tier}
              monthlyPrice={plan.monthlyPrice}
              annualPrice={plan.annualPrice}
              billingPeriod={billingPeriod}
              description={plan.description}
              features={plan.features}
              featured={plan.featured}
              delay={idx * 0.1}
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/pricing" className="text-purple-600 hover:text-purple-700 font-semibold text-lg inline-flex items-center group">
            View detailed pricing
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default PricingSection;
