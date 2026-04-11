"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";
import { AspectRatio } from "@/components/ui/AspectRatio";

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  // Split images into 3 columns for the masonry-like layout
  const cols = [[], [], []] as string[][];
  images.forEach((img, i) => {
    cols[i % 3].push(img);
  });

  return (
    <div className="relative flex w-full flex-col items-center justify-center py-10">
      <div className="mx-auto grid w-full max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {cols.map((colImages, colIdx) => (
          <div key={colIdx} className="grid gap-8 pt-4 md:pt-12">
            {colImages.map((src, index) => {
              // Alternate aspect ratios for a dynamic masonry feel
              const isPortrait = (index + colIdx) % 2 === 0;
              const ratio = isPortrait ? 4 / 5 : 1 / 1; // 4:5 for portraits, square for others

              return (
                <AnimatedImage
                  key={`${colIdx}-${index}`}
                  alt={`Portfolio Image ${colIdx}-${index}`}
                  src={src}
                  ratio={ratio}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

interface AnimatedImageProps {
  alt: string;
  src: string;
  ratio: number;
}

function AnimatedImage({ alt, src, ratio }: AnimatedImageProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <AspectRatio
      ref={ref}
      ratio={ratio}
      className="bg-[#FAF9F6] relative size-full rounded-none overflow-hidden"
    >
      <Image
        alt={alt}
        src={src}
        fill
        className={cn(
          "size-full rounded-none object-cover opacity-0 grayscale transition-all duration-1000 ease-in-out scale-105",
          {
            "opacity-100 grayscale-0 scale-100": isInView && !isLoading,
          }
        )}
        onLoad={() => setIsLoading(false)}
      />
    </AspectRatio>
  );
}
