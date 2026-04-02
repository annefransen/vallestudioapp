import React from "react";
import Image from "next/image";

export function AboutSection() {
  return (
    <section id="about" className="relative bg-[#FAF9F6] pt-32 pb-12 px-6 sm:px-12 lg:px-24 overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f0ede6] rounded-l-[100px] opacity-50 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <h4 className="text-xs font-bold tracking-widest text-[#1a1a1a] uppercase mb-4">
              Our Story
            </h4>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-[#1a1a1a] mb-8 leading-[1.1] tracking-tight">
              A Sanctuary for <br className="hidden md:block" />
              Elevated Beauty.
            </h2>
            
            <div className="space-y-6">
              <p className="text-gray-600 font-sans leading-relaxed text-lg font-medium">
                At Valle Studio Salon, we believe that self-care is an art form. 
                Our mission is to create an inspiring space where you can escape your daily routine and indulge in luxury treatments crafted specifically for you.
              </p>
              <p className="text-gray-500 font-sans leading-relaxed">
                From precision haircuts and transformative coloring to meticulously curated nail and brow services, our team of dedicated professionals utilizes the finest products to enhance your natural beauty. 
                Experience the Valle difference today.
              </p>
            </div>

            <button className="mt-10 px-8 py-4 bg-[#1a1a1a] text-white rounded-full text-sm font-bold tracking-wide hover:bg-black transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
              LEARN MORE
            </button>
          </div>

          {/* Image */}
          <div className="lg:col-span-7 relative w-full aspect-4/3 sm:aspect-square xl:aspect-4/3 rounded-[2rem] overflow-hidden order-1 lg:order-2 group shadow-2xl">
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700 z-10" />
            <Image
              src="/img/hero-va11e.png" 
              alt="Inside Valle Studio"
              fill
              className="object-cover object-center transition-all duration-1000 group-hover:scale-105"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
