// VALLE STUDIO LANDING PAGE
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AboutSection } from "@/components/home/about-section";
import { ServicesSection } from "@/components/home/services-section";
import { PortfolioSection } from "@/components/home/portfolio-section";
import { TeamSection } from "@/components/home/team-section";
import { FaqSection } from "@/components/home/faq-section";
import { CtaSection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/hero-valle.png"
            alt="Valle Studio Hero"
            fill
            priority
            className="object-cover object-[center_15%]"
          />
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-white/50" />
          </div>
        </motion.div>
      </section>

      <main className="min-h-screen">
        <AboutSection />
        <ServicesSection />
        <PortfolioSection />
        <TeamSection />
        <FaqSection />
        <CtaSection />
      </main>
    </div>
  );
}
