"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FaqCategory = "General" | "Booking" | "Services" | "Payment";

type FAQ = {
  question: string;
  answer: string;
  category: FaqCategory;
};

const faqs: FAQ[] = [
  {
    category: "Booking",
    question: "Do I need to book an appointment in advance?",
    answer: "Yes, we strongly recommend booking in advance, especially for extensive treatments like rebonding or coloring, to ensure we have dedicated time reserved just for you.",
  },
  {
    category: "Payment",
    question: "What forms of payment do you accept?",
    answer: "We accept Cash, GCash, PayMaya, and all major Credit/Debit Cards for your convenience. You can also pay securely online when booking through our website.",
  },
  {
    category: "Services",
    question: "Can I bring inspiration photos for my haircut or color?",
    answer: "Absolutely! Visuals are incredibly helpful. We encourage you to bring photos so our stylists understand your exact vision and can tailor the results perfectly.",
  },
  {
    category: "Booking",
    question: "What is your cancellation policy?",
    answer: "We kindly ask for at least 24 hours notice if you need to cancel or reschedule your appointment. This allows us to accommodate other clients on our waitlist.",
  },
  {
    category: "Services",
    question: "Do you offer consultations before service?",
    answer: "Yes! Every major hair color, extension, or rebonding service begins with a thorough consultation with your stylist to discuss your hair history, goals, and customized pricing.",
  },
];

const categories: FaqCategory[] = ["General", "Booking", "Services", "Payment"];

export function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory | "All">("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = activeCategory === "All" 
    ? faqs 
    : faqs.filter(f => f.category === activeCategory);

  return (
    <section id="faq" className="bg-white py-32 px-6 sm:px-12 lg:px-24">
      <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row gap-16 lg:gap-24">
        
        {/* Left Column */}
        <div className="md:w-1/3">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-[#1a1a1a] mb-4">
              Questions?<br />Look here.
            </h2>
            <p className="text-gray-400 font-sans text-sm max-w-xs">
              Can&apos;t find an answer? Call us at (123) 456-7890 or email contact@vallestudio.com!
            </p>
          </div>

          <h3 className="text-lg font-bold font-sans text-[#1a1a1a] mb-6">
            Table of Contents
          </h3>
          <ul className="space-y-4">
            <li>
              <button 
                onClick={() => setActiveCategory("All")}
                className={`text-sm font-semibold transition-colors ${activeCategory === "All" ? "text-blue-500" : "text-gray-500 hover:text-gray-900"}`}
              >
                All
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button 
                  onClick={() => setActiveCategory(cat)}
                  className={`text-sm font-semibold transition-colors ${activeCategory === cat ? "text-blue-500" : "text-gray-500 hover:text-gray-900"}`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - FAQ List */}
        <div className="md:w-2/3 md:pt-4">
          <div className="border-t border-gray-200">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-start text-left py-6 focus:outline-none"
                  >
                    <span className="text-blue-500 text-xl leading-none mr-6 font-medium mt-0.5 w-4 shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
                    <span className="text-lg font-sans font-bold text-[#1a1a1a]">
                      {faq.question}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pl-10 pb-6 pr-4 text-gray-600 font-medium font-sans leading-relaxed text-sm">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            
            {filteredFaqs.length === 0 && (
              <div className="py-12 text-center text-gray-500 font-medium">
                No questions found in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
