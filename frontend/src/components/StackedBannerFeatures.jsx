import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, Eye, Clock, FileCheck, DollarSign, Users, 
  ArrowRight, X
} from 'lucide-react';

const FEATURES_DATA = [
  {
    badge: "Core Feature",
    title: "Interactive Brief Builder",
    description: "Create beautiful, structured briefs with templates. Track who opened and acknowledged them. No more 'I didn't see the brief' excuses.",
    ctaText: "Explore Briefs",
    icon: <Layout className="w-7 h-7 text-white" />
  },
  {
    badge: "Collaboration",
    title: "Content Review & Approval",
    description: "Review drafts with timestamp comments. Request revisions with clear feedback. Track every version in one place.",
    ctaText: "See Reviews",
    icon: <Eye className="w-7 h-7 text-white" />
  },
  {
    badge: "Automation",
    title: "Deliverable Tracking",
    description: "See campaign progress at a glance. Automated reminders for deadlines. Never miss a post again.",
    ctaText: "Track Progress",
    icon: <Clock className="w-7 h-7 text-white" />
  },
  {
    badge: "Reporting",
    title: "One-Click Reporting",
    description: "Generate professional campaign reports instantly. Export as PDF or share via link. Save hours of manual work.",
    ctaText: "View Reports",
    icon: <FileCheck className="w-7 h-7 text-white" />
  },
  {
    badge: "Financial",
    title: "Payment Management",
    description: "Link payments to deliverables. Track what's paid and what's pending. Automate creator payments with confidence.",
    ctaText: "Manage Payments",
    icon: <DollarSign className="w-7 h-7 text-white" />
  },
  {
    badge: "Teamwork",
    title: "Team Collaboration",
    description: "Invite team members, assign roles, and collaborate seamlessly. Everyone stays in sync with real-time updates.",
    ctaText: "Add Team",
    icon: <Users className="w-7 h-7 text-white" />
  }
];

const StackedBannerFeatures = () => {
  const [currentIndex, setCurrentIndex] = useState(-1); // Start at -1 so first banner slides up
  const [isLocked, setIsLocked] = useState(false);
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

  // Intersection Observer for scroll lock activation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLocked(true);
          document.body.style.overflow = 'hidden';
          // Trigger first banner entrance if not already started
          if (currentIndex === -1) {
            setCurrentIndex(0);
          }
        } else if (!entry.isIntersecting && currentIndex <= 0) {
          setIsLocked(false);
          document.body.style.overflow = '';
          setCurrentIndex(-1); // Reset when scrolling back up out of view
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
  }, [currentIndex]);

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

      {/* Stacked Banners Container */}
      <div className="relative w-full max-w-[95%] lg:max-w-7xl mx-auto h-[85vh] min-h-[800px] flex items-center justify-center">
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
                  className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 h-[calc(100%-240px)] flex flex-col justify-center relative overflow-hidden"
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
