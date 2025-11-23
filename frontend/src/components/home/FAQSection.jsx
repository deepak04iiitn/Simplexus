import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import FAQItem from './FAQItem';

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

export default FAQSection;
