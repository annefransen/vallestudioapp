"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

const galleryImages = [
  "/img/hero-valle.png",
  "/img/AgnesCoprada-staff.jpg",
  "/img/JovieDultra-staff.jpg",
  "/img/PrincessAntonio-staff.jpg",
  "/img/hero-va11e.png",
  "/img/hero-valle.png",
  "/img/AgnesCoprada-staff.jpg",
  "/img/JovieDultra-staff.jpg",
  "/img/PrincessAntonio-staff.jpg",
  "/img/hero-valle.png",
  "/img/AgnesCoprada-staff.jpg",
  "/img/JovieDultra-staff.jpg",
  "/img/PrincessAntonio-staff.jpg",
  "/img/hero-va11e.png",
  "/img/hero-valle.png",
  "/img/AgnesCoprada-staff.jpg",
  "/img/JovieDultra-staff.jpg",
  "/img/PrincessAntonio-staff.jpg",
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="py-20 px-6 sm:px-12 lg:px-24 max-w-[1400px] mx-auto">
        {/* New Title Row */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-sans font-bold text-[#1a1a1a]">Team Portfolio</h1>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-500">
              32
            </span>
          </div>
          <Link 
            href="/"
            className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </Link>
        </div>

        {/* Masonry/Flexible Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryImages.map((src, idx) => (
            <div 
              key={idx} 
              className="relative overflow-hidden rounded-2xl group cursor-zoom-in break-inside-avoid"
            >
              <Image
                src={src}
                alt={`Gallery ${idx + 1}`}
                width={800}
                height={idx % 2 === 0 ? 1000 : 600}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
