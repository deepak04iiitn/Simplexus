import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Cal, { getCalApi } from "@calcom/embed-react";
import { 
  Mail, FileText, CheckCircle, Clock, DollarSign, MessageCircle, Target,
  Eye, RefreshCw, Zap, Users, Building2, Star, Check, ArrowRight, Play,
  TrendingUp, BarChart3, FileCheck, Layout, MessageSquare, Bell, ChevronDown,
  Rocket, Shield, Award, Layers, Globe, Lock, Calendar
} from 'lucide-react';
import StackedBannerFeatures from '../components/StackedBannerFeatures';



// Cal.com Embed Component
const CalEmbed = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"30min"});
      cal("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-purple-200" style={{ minHeight: '630px' }}>
      <Cal 
        namespace="30min"
        calLink="deepak-yadav-04/30min"
        style={{width:"100%",height:"630px",overflow:"scroll"}}
        config={{"layout":"month_view"}}
      />
    </div>
  );
};



export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced Design */}
      <section className="relative pt-32 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Text */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-5 py-2.5 bg-white rounded-full mb-8 shadow-lg border border-purple-100"
              >
                <Rocket className="w-4 h-4 text-purple-600 mr-2" />
                <span className="text-purple-600 font-semibold text-sm">The Future of Creator Campaigns</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Streamline Your{' '}
                <span className="relative inline-block">
                  <span className="text-purple-600">Creator</span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                    <path d="M2 10C60 2 140 2 198 10" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>
                {' '}Campaigns
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed"
              >
                From interactive briefs to automated reporting, Simplexus is the all-in-one platform that brands and agencies trust to manage creator collaborations seamlessly.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/sign-up" 
                    className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/demo" 
                    className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-purple-500 hover:text-purple-600 transition-all duration-300 shadow-lg"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-6 justify-center lg:justify-start"
              >
                <div className="flex items-center text-gray-600">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium">No credit card</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium">14-day trial</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Cancel anytime</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Dashboard Mockup - Enhanced */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Dashboard Card */}
                <div className="relative bg-white p-6 rounded-3xl shadow-2xl border border-gray-100">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl overflow-hidden">
                    <div className="bg-purple-600 p-5 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                        <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                        <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                      </div>
                      <span className="text-white text-sm font-semibold flex items-center">
                        <Layout className="w-4 h-4 mr-2" />
                        Campaign Dashboard
                      </span>
                      <div className="w-16"></div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="h-3 bg-gray-300 rounded w-24 mb-1"></div>
                            <div className="h-2 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="h-9 bg-purple-600 rounded-lg w-28"></div>
                      </div>
                      <div className="space-y-3">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: 1, duration: 0.6 }}
                          className="h-20 bg-white rounded-xl shadow-md p-4 flex items-center justify-between border border-purple-100"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg"></div>
                            <div>
                              <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                              <div className="h-2 bg-gray-100 rounded w-20"></div>
                            </div>
                          </div>
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </motion.div>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: 1.2, duration: 0.6 }}
                          className="h-20 bg-white rounded-xl shadow-md p-4 flex items-center justify-between border border-blue-100"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg"></div>
                            <div>
                              <div className="h-3 bg-gray-200 rounded w-28 mb-2"></div>
                              <div className="h-2 bg-gray-100 rounded w-16"></div>
                            </div>
                          </div>
                          <Clock className="w-6 h-6 text-orange-500" />
                        </motion.div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="bg-purple-200 rounded-lg p-3 text-center">
                          <div className="text-xs font-semibold text-purple-700">24</div>
                        </div>
                        <div className="bg-blue-200 rounded-lg p-3 text-center">
                          <div className="text-xs font-semibold text-blue-700">98%</div>
                        </div>
                        <div className="bg-green-200 rounded-lg p-3 text-center">
                          <div className="text-xs font-semibold text-green-700">156</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Badge Cards */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.6, type: "spring" }}
                  className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border-2 border-purple-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Active Campaigns</div>
                      <div className="text-2xl font-bold text-purple-600">24</div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.8, type: "spring" }}
                  className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border-2 border-green-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Success Rate</div>
                      <div className="text-2xl font-bold text-green-600">98%</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges with Infinite Carousel */}
      <section className="py-16 bg-white border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-500 text-sm font-medium mb-10 flex items-center justify-center"
          >
            <Shield className="w-4 h-4 mr-2" />
            Trusted by 500+ leading brands and agencies worldwide
          </motion.p>
          
          {/* Infinite Scrolling Brands Container */}
          <div className="relative">
            {/* Left Fade/Cloud Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
            
            {/* Right Fade/Cloud Effect */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
            
            {/* Scrolling Brands */}
            <div className="flex overflow-hidden">
              <motion.div
                className="flex gap-16 items-center"
                animate={{
                  x: [0, -1400]
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 25,
                    ease: "linear"
                  }
                }}
              >
                {/* First set of brands */}
                {['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E', 'Brand F', 'Brand G'].map((brand, idx) => (
                  <div 
                    key={`set1-${idx}`}
                    className="text-2xl font-bold text-gray-400 whitespace-nowrap flex-shrink-0 hover:text-purple-600 transition-colors duration-300"
                  >
                    {brand}
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E', 'Brand F', 'Brand G'].map((brand, idx) => (
                  <div 
                    key={`set2-${idx}`}
                    className="text-2xl font-bold text-gray-400 whitespace-nowrap flex-shrink-0 hover:text-purple-600 transition-colors duration-300"
                  >
                    {brand}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - New Addition */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <StatCard icon={<Users />} value="10K+" label="Active Users" delay={0} />
            <StatCard icon={<Globe />} value="50+" label="Countries" delay={0.1} />
            <StatCard icon={<Zap />} value="1M+" label="Campaigns Launched" delay={0.2} />
            <StatCard icon={<Award />} value="98%" label="Customer Satisfaction" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Problem Statement Section - Enhanced */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold mb-4">
              Common Pain Points
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              The <span className="text-purple-600">Problems</span> You're Facing Today
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Managing creator campaigns shouldn't feel like chaos. We've identified the pain points and built the solution.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProblemCard 
              icon={<Mail className="w-10 h-10" />}
              title="Brief Chaos"
              description="Sending briefs via email leads to confusion. No tracking if creators actually read them. Version control nightmares."
              color="purple"
              delay={0}
            />
            <ProblemCard 
              icon={<RefreshCw className="w-10 h-10" />}
              title="Approval Hell"
              description="3-5 rounds of revisions scattered across platforms. 'Which version did we approve?' becomes your daily question."
              color="blue"
              delay={0.1}
            />
            <ProblemCard 
              icon={<BarChart3 className="w-10 h-10" />}
              title="Tracking Disaster"
              description="Manually tracking deliverables across spreadsheets. No automated reminders. Progress visibility is zero."
              color="green"
              delay={0.2}
            />
            <ProblemCard 
              icon={<DollarSign className="w-10 h-10" />}
              title="Payment Confusion"
              description="'Did we pay this creator?' No clear connection between deliverable completion and payment status."
              color="orange"
              delay={0.3}
            />
            <ProblemCard 
              icon={<MessageCircle className="w-10 h-10" />}
              title="Communication Breakdown"
              description="Briefs lost in spam folders. Constant follow-ups. No confirmation creators understood the requirements."
              color="pink"
              delay={0.4}
            />
            <ProblemCard 
              icon={<FileText className="w-10 h-10" />}
              title="Reporting Nightmare"
              description="Manually compiling URLs, screenshots, and stats. Hours wasted creating a single client report."
              color="indigo"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Features Section - Stacked Banner Scroll Takeover */}
      <section className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Section Intro */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
              Powerful Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need in <span className="text-purple-600">One Platform</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From interactive briefs to automated reporting, discover the complete toolkit that streamlines your creator campaigns from start to finish.
            </p>
          </motion.div>
        </div>

        {/* Stacked Banner Features Component */}
        <StackedBannerFeatures />
      </section>


      {/* For Who Section - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-4">
              For Everyone
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Built for <span className="text-purple-600">Everyone</span> in the Ecosystem
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <SolutionCard 
              icon={<Building2 className="w-14 h-14" />}
              title="For Brands"
              description="Launch campaigns faster, approve content efficiently, and track ROI seamlessly."
              features={['Campaign management', 'Content approval workflows', 'Performance tracking']}
              color="purple"
              delay={0}
            />
            <SolutionCard 
              icon={<Target className="w-14 h-14" />}
              title="For Agencies"
              description="Manage multiple brands and hundreds of creators from one powerful dashboard."
              features={['Multi-brand management', 'Team collaboration', 'Client reporting']}
              color="blue"
              delay={0.1}
            />
            <SolutionCard 
              icon={<Star className="w-14 h-14" />}
              title="For Creators"
              description="Clear briefs, simple submissions, faster payments. Focus on what you do best."
              features={['Clear guidelines', 'Easy upload system', 'Public portfolio']}
              color="green"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section - New! */}
      <TestimonialsSection />

      {/* Pricing Teaser - Enhanced with Monthly/Annual Toggle */}
      <PricingSection />

      {/* Schedule a Call with Founder Section */}
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

      {/* FAQ Section - New! */}
      <FAQSection />

      {/* CTA Section with Wave Design - Enhanced! */}
      <section className="relative overflow-hidden">
        {/* Wave SVG */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#8b5cf6"></path>
          </svg>
        </div>

        <div className="relative bg-purple-600 pt-32 pb-24">
          {/* Decorative circles */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-purple-500 rounded-full text-purple-100 text-sm font-semibold mb-6">
                <TrendingUp className="w-4 h-4 mr-2" />
                Start Your Journey Today
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Ready to Transform Your{' '}
                <span className="relative inline-block">
                  Campaigns?
                  <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                    <path d="M2 10C60 2 140 2 198 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>
              </h2>
              
              <p className="text-xl md:text-2xl text-purple-100 mb-10 max-w-3xl mx-auto">
                Join 10,000+ brands and agencies already streamlining their creator collaborations
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/sign-up" 
                    className="inline-flex items-center px-10 py-5 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-2xl text-lg"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center px-10 py-5 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-300 text-lg"
                  >
                    <MessageSquare className="mr-3 w-6 h-6" />
                    Talk to Sales
                  </Link>
                </motion.div>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-purple-100">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Enterprise Security</span>
                </div>
                <div className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">GDPR Compliant</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg className="relative block w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#8b5cf6"></path>
          </svg>
        </div>
      </section>
    </div>
  );
}

// Stats Card Component
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

// Problem Card Component - Enhanced
function ProblemCard({ icon, title, description, color, delay }) {
  const colorClasses = {
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    pink: 'bg-pink-50 border-pink-200 text-pink-600',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-300"
    >
      <div className={`inline-flex items-center justify-center w-16 h-16 ${colorClasses[color]} rounded-2xl mb-5 border-2`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

// Feature Showcase Component - Enhanced
function FeatureShowcase({ icon, title, description, features, imagePosition, color }) {
  const colorClasses = {
    purple: 'bg-purple-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`grid lg:grid-cols-2 gap-12 items-center ${imagePosition === 'left' ? 'lg:flex-row-reverse' : ''}`}
    >
      <div className={imagePosition === 'left' ? 'lg:order-2' : ''}>
        <div className={`inline-flex items-center justify-center w-20 h-20 ${colorClasses[color]} rounded-2xl mb-6 shadow-lg`}>
          {icon}
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">{description}</p>
        <ul className="space-y-4">
          {features.map((feature, idx) => (
            <motion.li 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start group"
            >
              <CheckCircle className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <span className="text-gray-700 font-medium">{feature}</span>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className={imagePosition === 'left' ? 'lg:order-1' : ''}>
        <motion.div 
          whileHover={{ scale: 1.02, rotate: 1 }}
          className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-3xl p-12 aspect-square flex items-center justify-center shadow-2xl border-2 border-${color}-200`}
        >
          <div className="text-center">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className={`w-32 h-32 ${colorClasses[color]} rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl`}
            >
              <Layers className="w-16 h-16 text-white" />
            </motion.div>
            <p className={`text-${color}-700 font-bold text-lg`}>Feature Preview</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Solution Card Component - Enhanced
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

// Testimonials Section Component - Infinite Scrolling Columns
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechBrand Inc.",
      image: "SJ",
      rating: 5,
      content: "Simplexus transformed how we manage creator campaigns. What used to take days now takes hours. The ROI tracking alone has been worth it!"
    },
    {
      name: "Michael Chen",
      role: "Agency Owner",
      company: "Creative Pulse",
      image: "MC",
      rating: 5,
      content: "Managing 50+ creators across multiple brands was chaos before Simplexus. Now everything is organized, automated, and our clients love the reports."
    },
    {
      name: "Emily Rodriguez",
      role: "Brand Manager",
      company: "FashionCo",
      image: "ER",
      rating: 5,
      content: "The brief builder and approval workflow saved us countless hours. Creators actually acknowledge reading briefs now - game changer!"
    },
    {
      name: "David Kim",
      role: "Campaign Manager",
      company: "GrowthLabs",
      image: "DK",
      rating: 5,
      content: "Best investment we've made this year. The payment tracking linked to deliverables eliminated all confusion and disputes."
    },
    {
      name: "Lisa Anderson",
      role: "Social Media Lead",
      company: "BeautyBrand",
      image: "LA",
      rating: 5,
      content: "I was skeptical at first, but the one-click reporting feature alone pays for itself. Our team efficiency increased by 300%!"
    },
    {
      name: "James Wilson",
      role: "Creative Director",
      company: "Digital Wave",
      image: "JW",
      rating: 5,
      content: "Finally, a platform built by someone who understands the pain points. The version control for content approvals is brilliant."
    },
    {
      name: "Amanda Torres",
      role: "Growth Marketing Manager",
      company: "StartupXYZ",
      image: "AT",
      rating: 5,
      content: "The automated reminders and deadline tracking mean I never miss a deliverable. It's like having an assistant dedicated to campaign management!"
    },
    {
      name: "Robert Martinez",
      role: "Brand Partnerships Lead",
      company: "MediaCorp",
      image: "RM",
      rating: 5,
      content: "We've scaled from 10 to 200 creator partnerships without adding headcount. Simplexus handles the complexity so we can focus on relationships."
    },
    {
      name: "Jennifer Lee",
      role: "VP of Marketing",
      company: "E-commerce Plus",
      image: "JL",
      rating: 5,
      content: "The ROI dashboard gives us real-time insights that we share in board meetings. Finally, data-driven creator marketing is possible!"
    }
  ];

  // Split testimonials into 3 columns
  const column1 = testimonials.slice(0, 3);
  const column2 = testimonials.slice(3, 6);
  const column3 = testimonials.slice(6, 9);

  // Testimonial Card Component
  const TestimonialCard = ({ testimonial }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6 flex-shrink-0">
      {/* Rating Stars */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400" fill="#FBBF24" />
        ))}
      </div>

      {/* Testimonial Content */}
      <p className="text-gray-700 mb-6 leading-relaxed italic text-sm">
        "{testimonial.content}"
      </p>

      {/* Author Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
          {testimonial.image}
        </div>
        <div>
          <div className="font-bold text-gray-900 text-sm">{testimonial.name}</div>
          <div className="text-xs text-gray-600">{testimonial.role}</div>
          <div className="text-xs text-purple-600 font-semibold">{testimonial.company}</div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-24 bg-gradient-to-b from-white to-purple-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by <span className="text-purple-600">10,000+</span> Users
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what brands, agencies, and creators are saying about Simplexus
          </p>
        </motion.div>

        {/* Infinite Scrolling Testimonials Columns */}
        <div className="relative h-[600px]">
          {/* Top Fade Effect */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-50 via-purple-50/80 to-transparent z-10 pointer-events-none"></div>
          
          {/* Bottom Fade Effect */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-50 via-purple-50/80 to-transparent z-10 pointer-events-none"></div>

          {/* Three Columns with Opposite Scrolling */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {/* Column 1 - Scrolls Down */}
            <div className="overflow-hidden relative">
              <motion.div
                animate={{
                  y: [0, -1200]
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear"
                  }
                }}
              >
                {/* First set */}
                {column1.map((testimonial, idx) => (
                  <TestimonialCard key={`col1-set1-${idx}`} testimonial={testimonial} />
                ))}
                {/* Duplicate for seamless loop */}
                {column1.map((testimonial, idx) => (
                  <TestimonialCard key={`col1-set2-${idx}`} testimonial={testimonial} />
                ))}
              </motion.div>
            </div>

            {/* Column 2 - Scrolls Up (opposite direction) */}
            <div className="overflow-hidden relative hidden md:block">
              <motion.div
                animate={{
                  y: [-1200, 0]
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear"
                  }
                }}
              >
                {/* First set */}
                {column2.map((testimonial, idx) => (
                  <TestimonialCard key={`col2-set1-${idx}`} testimonial={testimonial} />
                ))}
                {/* Duplicate for seamless loop */}
                {column2.map((testimonial, idx) => (
                  <TestimonialCard key={`col2-set2-${idx}`} testimonial={testimonial} />
                ))}
              </motion.div>
            </div>

            {/* Column 3 - Scrolls Down (same as column 1) */}
            <div className="overflow-hidden relative hidden md:block">
              <motion.div
                animate={{
                  y: [0, -1200]
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear"
                  }
                }}
              >
                {/* First set */}
                {column3.map((testimonial, idx) => (
                  <TestimonialCard key={`col3-set1-${idx}`} testimonial={testimonial} />
                ))}
                {/* Duplicate for seamless loop */}
                {column3.map((testimonial, idx) => (
                  <TestimonialCard key={`col3-set2-${idx}`} testimonial={testimonial} />
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-full shadow-lg border-2 border-purple-200">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-10 h-10 bg-purple-600 rounded-full border-2 border-white flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" fill="white" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400" fill="#FBBF24" />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">4.9/5</span> from 2,500+ reviews
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Pricing Section Component with User Type and Billing Period Toggles
function PricingSection() {
  const [billingPeriod, setBillingPeriod] = React.useState('monthly');
  const [userType, setUserType] = React.useState('brand'); // 'brand' or 'creator'
  
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
            Pricing Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, <span className="text-purple-600">Transparent</span> Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-8">Choose the plan that fits your needs. Start free, scale as you grow.</p>
          
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

// Pricing Card Component - Enhanced with Annual Pricing
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

// FAQ Section Component
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does the 14-day free trial work?",
      answer: "Start using Simplexus immediately with full access to all features. No credit card required. After  14 days, choose a plan that fits your needs or continue with our free tier."
    },
    {
      question: "Can I switch plans later?",
      answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences in your billing."
    },
    {
      question: "How many team members can I add?",
      answer: "It depends on your plan. Starter allows 1 user, Growth allows 3 team members, and Agency Pro allows up to 10. Need more? Contact us for custom enterprise pricing."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use enterprise-grade encryption, regular security audits, and are fully GDPR compliant. Your data is stored securely and never shared with third parties."
    },
    {
      question: "Do you offer custom enterprise solutions?",
      answer: "Yes! For large agencies and enterprises with specific needs, we offer custom solutions with dedicated support, white-labeling, and custom integrations. Contact our sales team for details."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and for enterprise clients, we can arrange invoice-based billing."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold mb-4">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="text-purple-600">Questions</span>
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about Simplexus
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              delay={index * 0.1}
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-8 bg-purple-50 rounded-2xl border-2 border-purple-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Still have questions?</h3>
          <p className="text-gray-600 mb-6">Can't find the answer you're looking for? Our team is here to help.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/contact" 
              className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-lg"
            >
              <MessageSquare className="mr-2 w-5 h-5" />
              Contact Support
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// FAQ Item Component
function FAQItem({ question, answer, isOpen, onClick, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <button
        onClick={onClick}
        className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="text-lg font-semibold text-gray-900 pr-8">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-6 h-6 text-purple-600" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-6 text-gray-600 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
