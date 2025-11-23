import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Building2, Rocket, CheckCircle, Clock, Calendar, Shield
} from 'lucide-react';
import CalEmbed from './CalEmbed';

function ScheduleCallSection() {
  return (
    <section className="relative py-32 overflow-hidden bg-white">
      {/* Geometric Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-80 h-80 border-[30px] border-purple-50 rounded-full"
        ></motion.div>
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-80 h-80 border-[30px] border-blue-50 rounded-full"
        ></motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-5 py-2.5 bg-purple-600 text-white rounded-full text-sm font-bold mb-6 shadow-lg"
          >
            <Users className="w-4 h-4 mr-2" />
            Let's Talk
          </motion.span>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Schedule a Call with Our <span className="text-purple-600">Founder</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get personalized guidance, explore how Simplexus fits your needs, and discover strategies to scale your creator campaigns
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Founder Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <motion.div
              whileHover={{ y: -8, boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.25)" }}
              className="h-full bg-white rounded-3xl shadow-xl border-4 border-purple-600 overflow-hidden transition-all duration-300"
            >
              {/* Pattern Background */}
              <div className="absolute inset-0 opacity-5" style={{ 
                backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>

              <div className="relative p-10">
                {/* Founder Image Placeholder */}
                <div className="mb-8">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-32 h-32 bg-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl border-4 border-white"
                  >
                    <Users className="w-16 h-16 text-white" />
                  </motion.div>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Meet the Founder</h3>
                  <p className="text-purple-600 font-semibold text-lg mb-1">Founder & Developer</p>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">B.Tech Student, IIIT Nagpur</span>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="space-y-4 mb-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl border-2 border-purple-200"
                  >
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Built from Real Pain Points</p>
                      <p className="text-xs text-gray-600">Solving actual industry challenges</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl border-2 border-purple-200"
                  >
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Student Innovation</p>
                      <p className="text-xs text-gray-600">Fresh perspective on old problems</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl border-2 border-purple-200"
                  >
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Direct Access to Builder</p>
                      <p className="text-xs text-gray-600">Talk to who actually codes it</p>
                    </div>
                  </motion.div>
                </div>

                {/* Quote */}
                <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-purple-600">
                  <p className="text-gray-700 italic mb-3">
                    "I built Simplexus because I saw how chaotic creator campaign management was. As a student, I bring fresh ideas and I'm passionate about making this the best tool possible. Let's chat about your challenges!"
                  </p>
                  <p className="text-sm font-bold text-gray-900">- Founder, Simplexus</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Calendly Embed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            {/* Calendly Embed Card */}
            <motion.div
              whileHover={{ y: -8, boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.25)" }}
              className="bg-white rounded-3xl shadow-xl border-4 border-purple-600 overflow-hidden transition-all duration-300"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-fuchsia-600 p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-bold text-white">Book Your Free Consultation</h3>
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Clock className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">30 min</span>
                  </div>
                </div>
                <p className="text-purple-100 text-lg">
                  Schedule a personalized session to discuss your creator campaign strategy
                </p>
              </div>

              {/* Cal.com Embed Area */}
              <div className="p-8">
                {/* Cal.com Inline Embed */}
                <CalEmbed />

                {/* Trust Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">100% Free</p>
                      <p className="text-xs text-gray-600">No commitment</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Instant Booking</p>
                      <p className="text-xs text-gray-600">Choose your time</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ScheduleCallSection;
