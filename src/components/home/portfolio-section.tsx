"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const portfolioImages = [
  "/img/hero-valle.png",         // 1: Large Featured (2x2)
  "/img/AgnesCoprada-staff.jpg", // 2: Top Right 1
  "/img/JovieDultra-staff.jpg",  // 3: Top Right 2
  "/img/PrincessAntonio-staff.jpg", // 4: Mid Right 1
  "/img/hero-va11e.png",         // 5: Mid Right 2
  "/img/hero-valle.png",         // 6: Bottom Row 1
  "/img/AgnesCoprada-staff.jpg", // 7: Bottom Row 2
  "/img/JovieDultra-staff.jpg",  // 8: Bottom Row 3
  "/img/PrincessAntonio-staff.jpg", // 9: Bottom Row 4 (Overlay)
];

export function PortfolioSection() {
  const totalCount = 32; // Just a placeholder matching the screenshot

  return (
    <section id="portfolio" className="bg-white py-24 px-6 sm:px-12 lg:px-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-4xl font-sans font-bold text-[#1a1a1a]">Portfolio</h2>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-500">
            {totalCount}
          </span>
        </div>

        {/* Custom 4-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px]">
          {/* 1: Large Featured (2x2) */}
          <div className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl group">
            <Image
              src={portfolioImages[0]}
              alt="Portfolio Highlight"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* 2 & 3: Top Right */}
          <div className="relative overflow-hidden rounded-2xl group">
            <Image
              src={portfolioImages[1]}
              alt="Portfolio 2"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="relative overflow-hidden rounded-2xl group">
            <Image
              src={portfolioImages[2]}
              alt="Portfolio 3"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* 4 & 5: Middle Right */}
          <div className="relative overflow-hidden rounded-2xl group">
            <Image
              src={portfolioImages[3]}
              alt="Portfolio 4"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="relative overflow-hidden rounded-2xl group">
            <Image
              src={portfolioImages[4]}
              alt="Portfolio 5"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Bottom Row (Row 3) - 4 Items */}
          <div className="relative overflow-hidden rounded-2xl group">
            <Image
              src={portfolioImages[5]}
              alt="Portfolio 6"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="relative overflow-hidden rounded-2xl group">
            <Image
              src={portfolioImages[6]}
              alt="Portfolio 7"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="relative overflow-hidden rounded-2xl group">
            <Image
              src={portfolioImages[7]}
              alt="Portfolio 8"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* 9: Last Item with Overlay Link */}
          <Link 
            href="/portfolio" 
            className="relative overflow-hidden rounded-2xl group cursor-pointer block h-full"
          >
            <Image
              src={portfolioImages[8]}
              alt="Portfolio Total"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 group-hover:bg-black/50">
              <span className="text-white text-3xl font-bold">+{totalCount - 9}</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
