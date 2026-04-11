// LANDING PAGE
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ServicesSection } from "@/components/home/ServicesSection";
import { GallerySection } from "@/components/home/GallerySection";
import { FaqSection } from "@/components/home/FaqSection";
import { CtaSection } from "@/components/home/CtaSection";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <Navbar />
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

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl px-6">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4"
          ></motion.div>

          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[0.625rem] sm:text-xs font-bold tracking-[0.3em] text-white/70 uppercase mb-8"
          ></motion.p>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sans font-bold text-white text-[12vw] sm:text-[10vh] md:text-[12vh] leading-[1.1] mb-10 drop-shadow-xl tracking-tighter"
          >
            Where Beauty <br />
            Meets <span className="italic">Artistry</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/90 text-base sm:text-lg md:text-xl font-light tracking-wide leading-relaxed max-w-3xl"
          >
            You&apos;re not here to be made over. You&apos;re here to remember.
            This is where beauty becomes personal. Powerful Alive.
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-white/40" />
          </div>
        </motion.div>
      </section>

      <main className="min-h-screen">
        <ServicesSection />
        <GallerySection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
