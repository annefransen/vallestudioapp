"use client";

import React from "react";
import Link from "next/link";
import { GetStartedButton } from "@/components/ui/BookNowButton";

export function CtaSection() {
  return (
    <section className="bg-[#f3efee] py-16 md:py-20 px-6 sm:px-12 lg:px-24 border-t border-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-5xl md:text-7xl font-sans font-bold text-[#1a1a1a] tracking-tight leading-[1.1] mb-8 select-none cursor-default">
          Ready to <span className="italic">transform</span>?
        </h2>
        
        <p className="text-base md:text-lg text-[#1a1a1a]/60 font-sans leading-relaxed mb-12 max-w-2xl mx-auto select-none cursor-default">
          When you feel beautiful, inside and out, confidence flows effortlessly. At our salon, we’re here to bring out your natural beauty with simplicity.
        </p>

        {/* Action Button */}
        <div className="flex justify-center">
          <Link href="/register">
            <GetStartedButton />
          </Link>
        </div>
      </div>
    </section>
  );
}
