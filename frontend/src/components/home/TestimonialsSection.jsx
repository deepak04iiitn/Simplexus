import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

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

export default TestimonialsSection;
