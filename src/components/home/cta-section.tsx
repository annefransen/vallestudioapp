"use client";

import React from "react";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export function CtaSection() {
  const steps = [
    {
      number: "01",
      title: "IT ALL STARTS WITH YOU.",
      description: "Reach out to our team with questions or to schedule an appointment. We'll work with you to find the best time, treatment, and provider for you.",
    },
    {
      number: "02",
      title: "CUSTOMIZE YOUR TREATMENT PLAN.",
      description: "At the beginning of your appointment – or even as a standalone consultation – we'll create a custom treatment plan to help you reach your aesthetics and wellness goals.",
    },
    {
      number: "03",
      title: "LET'S GET THE BALL ROLLING!",
      description: "We're as excited to see your transformation as you are! Whether you're considering treatments for anti-aging or wellness, we're excited for you to see where this journey leads.",
    },
  ];

  return (
    <section className="bg-white py-32 px-6 sm:px-12 lg:px-24 border-t border-gray-50">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-20 md:mb-32">
          <h2 className="text-5xl md:text-7xl font-sans font-medium text-[#1a1a1a] tracking-tight leading-[1.1]">
            Here&apos;s <span className="font-heading italic">how</span> to get started.
          </h2>
        </div>

        {/* 3-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 mb-24 md:mb-32">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col group">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-sm font-bold text-gray-300 font-sans mt-0.5 group-hover:text-[#3D2B1F] transition-colors duration-500">
                  {step.number}
                </span>
                <div className="w-[1px] h-10 bg-gray-100 hidden sm:block" />
                <h3 className="text-sm font-extrabold tracking-widest text-[#1a1a1a] uppercase leading-tight pt-0.5">
                  {step.title}
                </h3>
              </div>
              <p className="text-sm text-gray-500 font-sans leading-relaxed pl-0 sm:pl-9">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Central Button */}
        <div className="flex justify-center">
          <Link
            href="/book"
            className="group inline-flex items-center gap-3 bg-[#3D2B1F] hover:bg-[#2A1D15] text-white px-10 py-5 rounded-full text-base font-bold transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-[#3D2B1F]/20"
          >
            BOOK AN APPOINTMENT
            <MoveRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
