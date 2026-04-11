"use client";

import React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { ImageGallery } from "@/components/ui/Gallery";

const galleryImages = [
  "/gallery/hair-1.png",
  "/gallery/hair-2.png",
  "/gallery/hair-3.png",
  "/gallery/hair-4.png",
  "/gallery/hair-5.png",
  "/gallery/hair-6.png",
  "/gallery/hair-7.png",
  "/gallery/nails-1.png",
  "/gallery/nails-2.png",
  "/gallery/nails-3.png",
  "/gallery/nails-4.png",
  "/gallery/nails-5.png",
  "/gallery/nails-6.png",
  "/gallery/nails-7.png",
  "/gallery/nails-8.png",
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="py-20 px-6 sm:px-12 lg:px-24 max-w-[1400px] mx-auto">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-20">
          <h1 className="text-4xl md:text-5xl font-sans font-bold text-[#1a1a1a]">Team Portfolio</h1>
          <Link 
            href="/"
            className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </Link>
        </div>

        {/* Dynamic Animated Gallery */}
        <ImageGallery images={galleryImages} />
      </main>
    </div>
  );
}
