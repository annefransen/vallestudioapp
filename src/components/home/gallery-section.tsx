"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

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

export function GallerySection() {
  return (
    <section
      id="gallery"
      className="bg-[#faf9f6] py-20 md:py-24 px-6 sm:px-12 lg:px-16"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-left mb-10">
          <h2 className="text-5xl md:text-6xl font-sans font-bold tracking-tighter text-[#1a1a1a] mb-6">
            GALLERY
          </h2>
        </div>

        {/* 4x2 Grid for 8 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
          {galleryImages.slice(0, 4).map((src: string, idx: number) => {
            const isLast = idx === 3;
            const content = (
              <div key={idx} className="flex flex-col group cursor-pointer">
                <div className="relative aspect-4/5 overflow-hidden rounded-sm bg-gray-100">
                  <Image
                    src={src}
                    alt={`Portfolio ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                  {isLast && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <span className="text-white text-md font-bold uppercase tracking-widest">
                        More
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );

            return isLast ? (
              <Link key={idx} href="/portfolio" className="block">
                {content}
              </Link>
            ) : (
              content
            );
          })}
        </div>
      </div>
    </section>
  );
}
