import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, Eye, Clock, FileCheck, DollarSign, Users, 
  ArrowRight, X, Layers, LayoutGrid
} from 'lucide-react';

const FEATURES_DATA = [
  {
    badge: "Core Feature",
    title: "Interactive Brief Builder",
    description: "Create beautifully designed campaign briefs with customizable templates. Track real-time engagement showing who opened and acknowledged them. Built-in version control keeps everyone aligned on the latest requirements, while read receipts eliminate the 'I didn't see it' excuse.",
    ctaText: "Explore Briefs",
    icon: <Layout className="w-7 h-7 text-white" />
  },
  {
    badge: "Collaboration",
    title: "Content Review & Approval",
    description: "Review creator submissions with time-stamped comments and visual annotations. Compare versions side-by-side and maintain a complete audit trail of changes. Clear, actionable feedback reduces revision cycles by 40% while keeping all stakeholders aligned.",
    ctaText: "See Reviews",
    icon: <Eye className="w-7 h-7 text-white" />
  },
  {
    badge: "Automation",
    title: "Deliverable Tracking",
    description: "Visualize campaign progress through intuitive dashboards showing what's submitted, pending, or approved at a glance. Automated smart reminders notify creators before deadlines with escalation workflows. Reduce campaign management time by 60% while ensuring zero missed deliverables.",
    ctaText: "Track Progress",
    icon: <Clock className="w-7 h-7 text-white" />
  },
  {
    badge: "Reporting",
    title: "One-Click Reporting",
    description: "Generate comprehensive campaign reports with all URLs, screenshots, and performance metrics in one click. Customize templates for different stakeholders and export as professional PDFs or shareable links. Automatically pull live data from social platforms, saving 10+ hours per report.",
    ctaText: "View Reports",
    icon: <FileCheck className="w-7 h-7 text-white" />
  },
  {
    badge: "Financial",
    title: "Payment Management",
    description: "Link payments directly to deliverables with conditional release workflows—pay only when content is approved and published. Track payment status across all creators with built-in invoice management. Automate processing and maintain complete financial transparency with audit logs.",
    ctaText: "Manage Payments",
    icon: <DollarSign className="w-7 h-7 text-white" />
  },
  {
    badge: "Teamwork",
    title: "Team Collaboration",
    description: "Invite unlimited team members with granular role-based permissions—give clients view-only access while your team manages campaigns. Collaborate in real-time with activity feeds showing who did what and when. Assign tasks, leave internal notes, and mention teammates for instant notifications.",
    ctaText: "Add Team",
    icon: <Users className="w-7 h-7 text-white" />
  }
];

const StackedBannerFeatures = () => {
  const [currentIndex, setCurrentIndex] = useState(-1); // Start at -1 so first banner slides up
  const [isLocked, setIsLocked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // New state for expanded view
  const [showTooltip, setShowTooltip] = useState(false); // State for tooltip visibility
  const [tooltipDismissed, setTooltipDismissed] = useState(false); // Track if user dismissed tooltip
  const [hasEnteredSection, setHasEnteredSection] = useState(false); // Track if user entered section
  const [inViewport, setInViewport] = useState(false); // Track if section is in viewport
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sectionRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  const touchStartYRef = useRef(0);

  // Check for reduced motion preference
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleChange);
    return () => motionQuery.removeEventListener('change', handleChange);
  }, []);

  // Intersection Observer for scroll lock activation and tooltip
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInViewport(true);
          setIsLocked(true);
          document.body.style.overflow = 'hidden';
          // Trigger first banner entrance if not already started
          if (currentIndex === -1) {
            setCurrentIndex(0);
          }
          // Show tooltip on first entry if not dismissed
          if (!hasEnteredSection && !tooltipDismissed) {
            setHasEnteredSection(true);
            // Delay tooltip appearance slightly for better UX
            setTimeout(() => {
              setShowTooltip(true);
            }, 800);
          }
        } else {
          setInViewport(false);
          if (currentIndex <= 0) {
            setIsLocked(false);
            document.body.style.overflow = '';
            setCurrentIndex(-1); // Reset when scrolling back up out of view
          } else {
            // Scrolled past the section going down
            setIsLocked(false);
            document.body.style.overflow = '';
          }
        }
      },
      { threshold: 0.6 } // Increased threshold for better lock timing
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      document.body.style.overflow = '';
    };
  }, [currentIndex, hasEnteredSection, tooltipDismissed]);

  // Navigate to next/previous banner
  const navigate = (direction) => {
    if (isTransitioningRef.current) return;

    const newIndex = currentIndex + direction;

    if (newIndex < 0) {
      // Allow scrolling to previous section
      setIsLocked(false);
      document.body.style.overflow = '';
      return;
    }

    if (newIndex >= FEATURES_DATA.length) {
      // Release scroll lock and allow page to continue
      setIsLocked(false);
      document.body.style.overflow = '';
      return;
    }

    isTransitioningRef.current = true;
    setCurrentIndex(newIndex);

    setTimeout(() => {
      isTransitioningRef.current = false;
    }, prefersReducedMotion ? 50 : 800);
  };

  // Wheel event handler
  useEffect(() => {
    if (!isLocked) return;

    const handleWheel = (e) => {
      const now = Date.now();
      if (now - lastScrollTimeRef.current < 50) return; // Reduced throttle for responsiveness

      e.preventDefault();
      e.stopPropagation();

      lastScrollTimeRef.current = now;

      requestAnimationFrame(() => {
        if (e.deltaY > 0) {
          navigate(1); // Scroll down
        } else {
          navigate(-1); // Scroll up
        }
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isLocked, currentIndex]);

  // Touch event handlers
  useEffect(() => {
    if (!isLocked) return;

    const handleTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }

      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - touchEndY;

      if (Math.abs(deltaY) > 30) { // Reduced threshold
        e.preventDefault();
        if (deltaY > 0) {
          navigate(1); // Swipe up
        } else {
          navigate(-1); // Swipe down
        }
        touchStartYRef.current = touchEndY;
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('touchstart', handleTouchStart, { passive: true });
      section.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      if (section) {
        section.removeEventListener('touchstart', handleTouchStart);
        section.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isLocked, currentIndex]);

  // Keyboard event handler
  useEffect(() => {
    if (!isLocked) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          navigate(1);
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          navigate(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, currentIndex]);

  // Toggle expanded view
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    // When expanding, release scroll lock
    if (!isExpanded) {
      setIsLocked(false);
      document.body.style.overflow = '';
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      aria-label="Product features showcase"
    >
      {/* ARIA Live Region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        Feature {currentIndex + 1} of {FEATURES_DATA.length}: {FEATURES_DATA[currentIndex]?.title}
      </div>

      {/* Floating Expand/Collapse Button - Shown when in features section */}
      <AnimatePresence>
        {inViewport && currentIndex >= 0 && !isExpanded && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleExpanded}
            className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center border-4 border-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 group"
            aria-label="Expand all features"
          >
            <LayoutGrid className="w-7 h-7 group-hover:rotate-180 transition-transform duration-500" />
            
            {/* Auto-show Tooltip with Dismiss */}
            <AnimatePresence>
              {showTooltip && !tooltipDismissed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -top-16 right-0 bg-gray-900 text-white px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl flex items-center gap-3"
                >
                  <span>View All Features</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTooltip(false);
                      setTooltipDismissed(true);
                    }}
                    className="hover:bg-white/20 rounded p-0.5 transition-colors"
                    aria-label="Dismiss tooltip"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Hover Tooltip (only shows when auto-tooltip is dismissed) */}
            <span className="absolute -top-12 right-0 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-xl" style={{ display: tooltipDismissed ? 'block' : 'none' }}>
              View All Features
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Stacked Banners Container or Expanded Grid */}
      {!isExpanded ? (
        <div className="relative w-full max-w-full lg:max-w-[1400px] mx-auto h-[85vh] min-h-[800px] flex items-center justify-center px-4">
          <div className="relative w-full h-full">
          {FEATURES_DATA.map((feature, index) => {
            const isCurrent = index === currentIndex;
            const isPast = index < currentIndex;
            const isFuture = index > currentIndex;

            // Calculate stacking offset
            const stackPosition = index * 40;
            
            return (
              <motion.div
                key={index}
                className="absolute inset-0 w-full h-full"
                initial={{ y: '100vh', opacity: 0 }}
                animate={{
                  y: isFuture ? '100vh' : stackPosition,
                  scale: isCurrent ? 1 : 1, // Keep scale 1 for clean stack
                  opacity: 1, // Always visible once entered
                  zIndex: index // Ensure proper layering (0 at bottom, 5 at top)
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.8,
                  ease: [0.16, 1, 0.3, 1], // Ultra smooth spring-like ease
                  type: "spring",
                  stiffness: 60,
                  damping: 15
                }}
                style={{
                  pointerEvents: isCurrent ? 'auto' : 'none',
                  top: 0 // Ensure top alignment
                }}
              >
                <div
                  className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 h-[calc(100%-160px)] flex flex-col justify-center relative"
                  style={{
                    boxShadow: '0 -10px 40px -10px rgba(0,0,0,0.1)' // Shadow pointing up to show separation
                  }}
                >
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      {/* Icon */}
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-8 shadow-lg shadow-indigo-500/30">
                        {feature.icon}
                      </div>

                      {/* Badge */}
                      <div className="block mb-6">
                        <span className="inline-block px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-full uppercase tracking-wider">
                          {feature.badge}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
                        {feature.description}
                      </p>

                      {/* CTA Button */}
                      <motion.button
                        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                        whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                        className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        tabIndex={isCurrent ? 0 : -1}
                      >
                        {feature.ctaText}
                        <ArrowRight className="ml-2 w-6 h-6" />
                      </motion.button>
                    </div>

                    {/* Right Side - Visual/Abstract Graphic */}
                    <div className="hidden lg:flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white rounded-3xl transform rotate-3 opacity-50"></div>
                      <div className="relative w-full aspect-square max-w-md bg-gradient-to-br from-indigo-100 to-white rounded-3xl border border-indigo-50 flex items-center justify-center overflow-hidden">
                        {/* Abstract shapes based on feature index */}
                        <motion.div 
                          animate={{ 
                            rotate: [0, 10, 0],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ 
                            duration: 10, 
                            repeat: Infinity,
                            ease: "easeInOut" 
                          }}
                          className="w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl absolute"
                        />
                        {React.cloneElement(feature.icon, { className: "w-32 h-32 text-indigo-200 opacity-20" })}
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
      ) : (
        /* Expanded Vertical Layout */
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Close/Collapse Button */}
          <div className="flex justify-end mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleExpanded}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              aria-label="Collapse features"
            >
              <Layers className="w-5 h-5" />
              Return to Stack View
            </motion.button>
          </div>

          {/* Expanded Cards Grid */}
          <div className="space-y-8">
            {FEATURES_DATA.map((feature, index) => (
              <motion.div
                key={`expanded-${index}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-8 shadow-lg shadow-indigo-500/30">
                      {feature.icon}
                    </div>

                    {/* Badge */}
                    <div className="block mb-6">
                      <span className="inline-block px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-full uppercase tracking-wider">
                        {feature.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl">
                      {feature.description}
                    </p>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 transition-colors duration-200"
                    >
                      {feature.ctaText}
                      <ArrowRight className="ml-2 w-6 h-6" />
                    </motion.button>
                  </div>

                  {/* Right Side - Visual */}
                  <div className="hidden lg:flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white rounded-3xl transform rotate-3 opacity-50"></div>
                    <div className="relative w-full aspect-square max-w-md bg-gradient-to-br from-indigo-100 to-white rounded-3xl border border-indigo-50 flex items-center justify-center overflow-hidden">
                      <motion.div 
                        animate={{ 
                          rotate: [0, 10, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                          duration: 10, 
                          repeat: Infinity,
                          ease: "easeInOut" 
                        }}
                        className="w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl absolute"
                      />
                      {React.cloneElement(feature.icon, { className: "w-32 h-32 text-indigo-200 opacity-20" })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Scroll Hint (only on first banner) */}
      {currentIndex === 0 && isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-50"
        >
          <p className="text-sm text-gray-500 mb-2">Scroll to explore features</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-300 rounded-full mx-auto flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-2 bg-gray-400 rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default StackedBannerFeatures;
