"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "Do I need an appointment, or do you accept walk-ins?",
    answer: "We recommend booking an appointment to secure your slot, but walk-ins are welcome depending on availability.",
  },
  {
    question: "How long does a hair color service take?",
    answer: "It usually takes 2–4 hours depending on hair length, thickness, and the type of color service.",
  },
  {
    question: "How much is hair rebond/keratin/color?",
    answer: "Prices vary depending on hair length and thickness. See our pricelist for reference.",
  },
  {
    question: "Can I bring my own nail design inspiration?",
    answer: "Of course! Feel free to show us pegs or photos",
  },
  {
    question: "Should I wash my hair before a color appointment?",
    answer: "Please come with clean, dry hair unless advised otherwise.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "Cash / GCash / Bank transfer (BPI BDO Gotyme)",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-[#f3efee] py-20 md:py-24 px-6 sm:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-16 lg:gap-55 md:justify-center">
        
        {/* Left Column - Title & Info */}
        <div className="md:w-5/12 lg:w-1/3">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-sans font-bold text-[#1a1a1a] leading-[1.05] tracking-tighter whitespace-pre-line select-none cursor-default">
              Everything you{"\n"}<span className="italic">might wonder.</span>
            </h2>
            <div className="mt-8 space-y-4 select-none cursor-default">
              <p className="font-sans text-[0.9375rem] font-bold text-[#1a1a1a]">Got more questions?</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#1a1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-[0.9375rem] text-[#1a1a1a] font-medium">0908 863 2831</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#1a1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[0.9375rem] text-[#1a1a1a] font-medium">vallestudiosalon@gmail.com</span>
                </div>
              </div>

              {/* Google Map */}
              <div className="mt-10 w-full h-[320px] rounded-xl overflow-hidden shadow-sm border border-black/5 transition-all duration-700 ease-in-out">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3855.876238323019!2d120.96468697587791!3d14.888197269969297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397abb7e84162d7%3A0x880620b018693c7!2sValle%20Studio!5e0!3m2!1sen!2sph!4v1775242275931!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - FAQ Accordion */}
        <div className="md:w-7/12 lg:w-1/2 md:mt-12">
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="border-none py-2">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-start text-left py-5 focus:outline-none group cursor-pointer"
                  >
                    <span className="text-[#1a1a1a] text-xl leading-none mr-6 font-medium mt-0.5 w-4 shrink-0 transition-transform duration-300">
                      {isOpen ? "−" : "+"}
                    </span>
                    <span className="text-lg font-sans font-semibold text-[#1a1a1a] group-hover:text-[#1a1a1a] transition-colors leading-snug">
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
                        <div className="pl-10 pb-8 pr-4 text-[#1a1a1a] text-[1.0625rem] font-sans leading-relaxed select-none cursor-default">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
