import React from "react";

export function AboutSection() {
  return (
    <section id="about" className="relative bg-[#1a1a1a] py-20 md:py-24 px-6 sm:px-12 lg:px-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Heading Block */}
          <div className="mb-16 select-none cursor-default">
            <h4 className="text-xs font-bold tracking-[0.3em] text-[#beb9b7] uppercase mb-8 font-sans">
              ABOUT VALLE STUDIO
            </h4>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold text-white leading-[1.05] tracking-tighter">
              Where Beauty <br /> Meets Artistry
            </h2>
          </div>

          {/* Description Block */}
          <div className="space-y-10 text-lg md:text-2xl text-white/60 font-sans leading-relaxed select-none cursor-default">
            <p>
              We believe beauty is personal. That&apos;s why every service at Valle Studio is tailored to 
              bring out your unique style and confidence.
            </p>
            <p>
              Our passionate team combines years of expertise with the latest techniques to deliver 
              exceptional results in a space designed for your comfort.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
