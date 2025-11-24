import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  RefreshCw, 
  BarChart3, 
  DollarSign, 
  MessageCircle, 
  FileText,
  CheckCircle,
  ChevronDown
} from 'lucide-react';

const ChallengesSection = () => {
  const containerRef = useRef(null);
  const expandableCardsRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Click outside to close expanded card
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandableCardsRef.current && !expandableCardsRef.current.contains(event.target)) {
        setExpandedCard(null);
      }
    };

    if (expandedCard !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expandedCard]);

  const challenges = [
    {
      id: 1,
      title: "Brief Chaos",
      icon: Mail,
      color: "bg-purple-500",
      gradientLine: "from-purple-400 to-purple-200",
      description: "Email briefs get lost, ignored, or misunderstood. No confirmation creators read them, leading to endless back-and-forth."
    },
    {
      id: 2,
      title: "Reporting Nightmare",
      icon: FileText,
      color: "bg-indigo-500",
      gradientLine: "from-indigo-400 to-indigo-200",
      description: "Hours wasted manually compiling URLs, screenshots, and metrics into client reports. No automation, just tedious copying."
    },
    {
      id: 3,
      title: "Tracking Disaster",
      icon: BarChart3,
      color: "bg-emerald-500",
      gradientLine: "from-emerald-400 to-emerald-200",
      description: "Spreadsheet chaos with zero automation. No reminders, no real-time updates, no visibility into campaign progress."
    },
    {
      id: 4,
      title: "Approval Hell",
      icon: RefreshCw,
      color: "bg-blue-500",
      gradientLine: "from-blue-400 to-blue-200",
      description: "3-5 revision rounds across email, Slack, and WhatsApp. Which version was approved? Nobody knows anymore."
    },
    {
      id: 5,
      title: "Communication Breakdown",
      icon: MessageCircle,
      color: "bg-pink-500",
      gradientLine: "from-pink-400 to-pink-200",
      description: "Messages lost in spam, constant follow-ups required. No centralized hub for all campaign conversations."
    },
    {
      id: 6,
      title: "Payment Confusion",
      icon: DollarSign,
      color: "bg-orange-500",
      gradientLine: "from-orange-400 to-orange-200",
      description: "Disconnected payment tracking from deliverables. Creators asking 'where's my payment?' becomes a daily occurrence."
    }
  ];

  // Calculate positions for each card (for desktop radial layout)
  const getCardPosition = (index) => {
    const positions = {
      0: { top: '5%', left: '30%', transform: 'translate(-50%, -50%)' },
      1: { top: '5%', right: '15%', transform: 'translate(0%, -50%)' },
      2: { top: '50%', left: '0%', transform: 'translate(0%, -50%)' },
      3: { top: '50%', right: '0%', transform: 'translate(0%, -50%)' },
      4: { bottom: '5%', left: '15%', transform: 'translate(0%, 50%)' },
      5: { bottom: '5%', right: '15%', transform: 'translate(0%, 50%)' }
    };
    return positions[index];
  };

  // Get line coordinates
  const getLineCoordinates = (index) => {
    const centerX = 50;
    const centerY = 50;
    
    const endpoints = {
      0: { x: 30, y: 5 },   // Brief Chaos - top left
      1: { x: 70, y: 5 },   // Reporting Nightmare - top right
      2: { x: 12, y: 50 },  // Tracking Disaster - left
      3: { x: 88, y: 50 },  // Approval Hell - right
      4: { x: 30, y: 95 },  // Communication - bottom left
      5: { x: 70, y: 95 }   // Payment - bottom right
    };

    return {
      x1: centerX,
      y1: centerY,
      x2: endpoints[index].x,
      y2: endpoints[index].y
    };
  };

  // Mobile Card Component (Static with full description always visible)
  const MobileCard = ({ challenge, index }) => {
    const Icon = challenge.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          delay: index * 0.1,
          duration: 0.5
        }}
        className="group"
      >
        <div className="relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 h-full flex flex-col">
          {/* Gradient accent line */}
          <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${challenge.gradientLine}`}></div>
          
          {/* Icon */}
          <div className="flex justify-center mb-4 pt-2">
            <div className={`w-16 h-16 rounded-2xl ${challenge.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
              <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base md:text-lg font-bold text-slate-800 text-center mb-3 group-hover:text-purple-600 transition-colors">
            {challenge.title}
          </h3>

          {/* Description - Always visible on mobile */}
          <p className="text-sm text-slate-600 leading-relaxed text-center">
            {challenge.description}
          </p>
        </div>
      </motion.div>
    );
  };

  // Desktop Expandable Card Component
  const DesktopExpandableCard = ({ challenge, index }) => {
    const Icon = challenge.icon;
    const isExpanded = expandedCard === challenge.id;
    const position = getCardPosition(index);

    return (
      <div
        className="absolute"
        style={{
          ...position,
          zIndex: isExpanded ? 50 : 10
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ 
            delay: 0.5 + (index * 0.1),
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ 
            scale: 1.05,
            y: -5,
            transition: { duration: 0.2 }
          }}
          onClick={(e) => {
            e.stopPropagation();
            setExpandedCard(isExpanded ? null : challenge.id);
          }}
          className="group cursor-pointer"
        >
          <div className="relative bg-white rounded-2xl px-4 py-3 md:px-5 md:py-4 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
            {/* Gradient accent line */}
            <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${challenge.gradientLine}`}></div>
            
            {/* Content */}
            <div className="flex items-center gap-3 pt-1">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${challenge.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs md:text-sm lg:text-base font-bold text-slate-800 group-hover:text-purple-600 transition-colors leading-tight whitespace-nowrap">
                  {challenge.title}
                </h3>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
              </motion.div>
            </div>

            {/* Expandable Description */}
            <motion.div
              initial={false}
              animate={{ 
                height: isExpanded ? 'auto' : 0,
                opacity: isExpanded ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <p className="text-xs md:text-sm text-slate-600 mt-3 pt-3 border-t border-slate-100 leading-relaxed">
                {challenge.description}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Elegant background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-100 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-100 rounded-full blur-[120px]"></div>
      </div>

      {/* Dot pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
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
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 mb-6 md:mb-8 tracking-tighter leading-[1.1]">
            Stop Fighting
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-rose-600 to-pink-600">
              Campaign Chaos
            </span>
          </h2>
          
          {/* Refined Description */}
          <p className="text-base md:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            These daily frustrations inspired us to build Simplexus—your antidote to creator campaign complexity.
          </p>
        </motion.div>

        {/* Mobile/Tablet Grid Layout - Square cards with static descriptions */}
        <div className="block lg:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge, index) => (
              <MobileCard key={challenge.id} challenge={challenge} index={index} />
            ))}
          </div>
        </div>

        {/* Desktop Radial Hub Layout with expandable cards */}
        <div className="hidden lg:block relative max-w-6xl mx-auto" ref={expandableCardsRef}>
          {/* Container for radial layout */}
          <div 
            ref={containerRef}
            className="relative w-full h-[600px]"
          >
            
            {/* SVG Lines Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {challenges.map((challenge, index) => {
                const coords = getLineCoordinates(index);
                return (
                  <motion.line
                    key={`line-${challenge.id}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.4 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: 0.5 + (index * 0.1), 
                      duration: 0.8,
                      ease: "easeOut" 
                    }}
                    x1={`${coords.x1}%`}
                    y1={`${coords.y1}%`}
                    x2={`${coords.x2}%`}
                    y2={`${coords.y2}%`}
                    stroke="#a78bfa"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                  />
                );
              })}
            </svg>

            {/* Central Hub */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                delay: 0.3, 
                type: "spring", 
                stiffness: 200,
                damping: 15 
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className="relative group">
                {/* Animated rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute w-32 h-32 lg:w-40 lg:h-40 rounded-full border-2 border-purple-400"
                  />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      delay: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute w-32 h-32 lg:w-40 lg:h-40 rounded-full border-2 border-blue-400"
                  />
                </div>

                {/* Central icon */}
                <div className="relative w-28 h-28 lg:w-32 lg:h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center border-4 border-purple-100 group-hover:border-purple-300 transition-all duration-500">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Challenge Cards in radial positions */}
            {challenges.map((challenge, index) => (
              <DesktopExpandableCard key={challenge.id} challenge={challenge} index={index} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
          className="text-center mt-12 md:mt-20"
        >
          <p className="text-base md:text-lg text-slate-600 mb-6">
            Ready to eliminate these challenges from your workflow?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-sm md:text-base"
          >
            See How Simplexus Solves This
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ChallengesSection;
