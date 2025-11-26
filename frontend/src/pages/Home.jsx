import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, FileText, CheckCircle, Clock, DollarSign, MessageCircle, Target,
  Eye, RefreshCw, Zap, Users, Building2, Star, Check, ArrowRight, Play,
  TrendingUp, BarChart3, FileCheck, Layout, MessageSquare, Bell, ChevronDown,
  Rocket, Shield, Award, Layers, Globe, Lock, Calendar
} from 'lucide-react';
import StatCard from '../components/home/StatCard';
import ProblemCard from '../components/home/ProblemCard';
import SolutionCard from '../components/home/SolutionCard';
import TestimonialsSection from '../components/home/TestimonialsSection';
import PricingSection from '../components/home/PricingSection';
import ScheduleCallSection from '../components/home/ScheduleCallSection';
import FAQSection from '../components/home/FAQSection';

export default function Home() {
  const features = [
    {
      label: 'Interactive Briefs',
      title: 'Turn Chaos into Clear, Actionable Briefs',
      description:
        'Replace scattered Google Docs and email threads with a single, structured brief hub that every creator can actually understand and follow.',
      points: [
        'Rich, guided brief templates tailored for creator campaigns',
        'Mandatory fields so key details are never missed again',
        'Real-time status on who has viewed and accepted the brief',
      ],
      icon: Layout,
      accent: 'from-purple-500 via-violet-500 to-indigo-500',
    },
    {
      label: 'Content Approvals',
      title: 'Approve Content in Minutes, Not Weeks',
      description:
        'Centralize every draft, comment, and approval so your team never has to ask “Which version did we sign off on?” again.',
      points: [
        'Side‑by‑side comparison of revisions for faster decisions',
        'Clear approval trails for legal and compliance teams',
        'Smart reminders that nudge creators and stakeholders',
      ],
      icon: CheckCircle,
      accent: 'from-blue-500 via-sky-500 to-cyan-500',
    },
    {
      label: 'Deliverables & Tracking',
      title: 'Always Know What’s Live, Pending, or Late',
      description:
        'Give everyone instant visibility into deliverables, deadlines, and performance—without living inside a spreadsheet.',
      points: [
        'Timeline view of every deliverable across all creators',
        'Automatic status updates as links and proofs are submitted',
        'Single source of truth for URLs, screenshots, and results',
      ],
      icon: BarChart3,
      accent: 'from-emerald-500 via-teal-500 to-green-500',
    },
    {
      label: 'Payments & Reporting',
      title: 'Pay Creators Confidently and Prove ROI Instantly',
      description:
        'Connect completed work to payouts and client‑ready reports so finance and account teams stay perfectly in sync.',
      points: [
        'Payment readiness tied directly to deliverable completion',
        'Campaign summaries ready to export to your clients',
        'Unified view of spend, performance, and ROI by campaign',
      ],
      icon: DollarSign,
      accent: 'from-amber-500 via-orange-500 to-rose-500',
    },
  ];

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
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 leading-tight"
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
                transition={{ delay: 0.35 }}
                className="text-2xl md:text-3xl font-light text-purple-600 mb-6 italic leading-relaxed"
              >
                Simplifying the nexus of collaboration
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed"
              >
                The most affordable all-in-one platform for managing creator collaborations. From interactive briefs to automated reporting, Simplexus delivers enterprise features at startup-friendly prices.
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
                  <span className="text-sm font-medium">Most Affordable</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium">7-day free trial</span>
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

      {/* Stats Section */}
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

      {/* Problem Statement Section */}
      <section className="relative py-40 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
        {/* Elegant background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-100 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-100 rounded-full blur-[120px]"></div>
        </div>

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-bold mb-8 shadow-xl shadow-slate-900/20 border border-slate-700"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="tracking-wide">THE CHALLENGES WE SOLVE</span>
            </motion.div>
            
            {/* Premium Heading */}
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]">
              Stop Fighting
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-rose-600 to-pink-600">
                Campaign Chaos
              </span>
            </h2>
            
            {/* Refined Description */}
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              These daily frustrations inspired us to build Simplexus—your antidote to creator campaign complexity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProblemCard 
              icon={<Mail className="w-8 h-8" />}
              title="Brief Chaos"
              description="Sending briefs via email leads to confusion. No tracking if creators actually read them. Version control nightmares."
              color="purple"
              delay={0}
              metaLeft="Messy briefs"
              metaRight="Clear, central hub"
            />
            <ProblemCard 
              icon={<RefreshCw className="w-8 h-8" />}
              title="Approval Hell"
              description="3-5 rounds of revisions scattered across platforms. 'Which version did we approve?' becomes your daily question."
              color="blue"
              delay={0.1}
              metaLeft="Endless revisions"
              metaRight="One approval trail"
            />
            <ProblemCard 
              icon={<BarChart3 className="w-8 h-8" />}
              title="Tracking Disaster"
              description="Manually tracking deliverables across spreadsheets. No automated reminders. Progress visibility is zero."
              color="emerald"
              delay={0.2}
              metaLeft="Spreadsheet overload"
              metaRight="Live status view"
            />
            <ProblemCard 
              icon={<DollarSign className="w-8 h-8" />}
              title="Payment Confusion"
              description="'Did we pay this creator?' No clear connection between deliverable completion and payment status."
              color="orange"
              delay={0.3}
              metaLeft="Unclear payouts"
              metaRight="Proof‑linked payments"
            />
            <ProblemCard 
              icon={<MessageCircle className="w-8 h-8" />}
              title="Communication Breakdown"
              description="Briefs lost in spam folders. Constant follow-ups. No confirmation creators understood the requirements."
              color="pink"
              delay={0.4}
              metaLeft="Scattered chats"
              metaRight="Aligned conversations"
            />
            <ProblemCard 
              icon={<FileText className="w-8 h-8" />}
              title="Reporting Nightmare"
              description="Manually compiling URLs, screenshots, and stats. Hours wasted creating a single client report."
              color="indigo"
              delay={0.5}
              metaLeft="Manual reports"
              metaRight="Instant summaries"
            />
          </div>
        </div>
      </section>

      {/* Features Section - Alternating Sliding Features */}
      <section className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">
          {/* Section Intro */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
              Powerful Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need in <span className="text-purple-600">One Platform</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the core workflows that turn messy creator campaigns into a calm, repeatable operating system for your team.
            </p>
          </motion.div>

          <div className="space-y-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.65, delay: index * 0.2, ease: 'easeOut' }}
                  className="grid gap-10 md:grid-cols-2 items-center"
                >
                  {/* Text Content */}
                  <div className={isEven ? 'order-1 md:order-1' : 'order-2 md:order-2'}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border border-purple-100 mb-4">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                        {feature.label}
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.points.map((point) => (
                        <li key={point} className="flex items-start gap-3">
                          <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                            <Check className="w-4 h-4" />
                          </div>
                          <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual Side / "Image" */}
                  <div className={isEven ? 'order-2 md:order-2' : 'order-1 md:order-1'}>
                    <div className="relative">
                      {/* Glow background */}
                      <div className="absolute inset-6 rounded-3xl bg-gradient-to-br from-purple-200/40 via-blue-200/40 to-emerald-200/40 blur-2xl" />

                      {/* Main card acting as image/visual */}
                      <div className="relative rounded-3xl bg-slate-950 overflow-hidden shadow-2xl border border-slate-800">
                        <div
                          className={`h-28 bg-gradient-to-r ${feature.accent}`}
                        >
                          <div className="h-full w-full flex items-center justify-between px-8">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-white/70">
                                  Simplexus
                                </p>
                                <p className="text-sm font-semibold text-white">
                                  {feature.label}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                              <span className="inline-flex h-2 w-2 rounded-full bg-amber-300" />
                              <span className="inline-flex h-2 w-2 rounded-full bg-rose-300" />
                            </div>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-6 bg-slate-950">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 space-y-3">
                              <div className="h-3 w-24 rounded-full bg-slate-800" />
                              <div className="h-4 w-40 rounded-full bg-slate-800" />
                              <div className="space-y-2 pt-1">
                                <div className="h-2 w-full rounded-full bg-slate-800" />
                                <div className="h-2 w-5/6 rounded-full bg-slate-900" />
                                <div className="h-2 w-4/6 rounded-full bg-slate-900" />
                              </div>
                            </div>
                            <div className="flex flex-col justify-between">
                              <div className="h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">
                                  98%
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-2">
                                On‑time completion when campaigns run through Simplexus.
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-2xl bg-slate-900 border border-slate-800 px-3 py-2">
                              <p className="text-[11px] text-slate-400 mb-1">
                                Creators
                              </p>
                              <p className="text-sm font-semibold text-white">
                                240
                              </p>
                            </div>
                            <div className="rounded-2xl bg-slate-900 border border-slate-800 px-3 py-2">
                              <p className="text-[11px] text-slate-400 mb-1">
                                Live briefs
                              </p>
                              <p className="text-sm font-semibold text-white">
                                36
                              </p>
                            </div>
                            <div className="rounded-2xl bg-slate-900 border border-slate-800 px-3 py-2">
                              <p className="text-[11px] text-slate-400 mb-1">
                                Approvals
                              </p>
                              <p className="text-sm font-semibold text-emerald-400">
                                Instant
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* For Who Section */}
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

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Schedule a Call with Founder Section */}
      <ScheduleCallSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section with Wave Design */}
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