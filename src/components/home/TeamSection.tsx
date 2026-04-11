"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type Staff = {
  name: string;
  role: string;
  image: string;
};

const team: Staff[] = [
  {
    name: "Agnes Coprada",
    role: "Senior Hair Stylist",
    image: "/img/AgnesCoprada-staff.jpg",
  },
  {
    name: "Jovie Dultra",
    role: "Nail & Spa Specialist",
    image: "/img/JovieDultra-staff.jpg",
  },
  {
    name: "Princess Antonio",
    role: "Brow Expert",
    image: "/img/PrincessAntonio-staff.jpg",
  },
];

export function TeamSection() {
  return (
    <section id="team" className="relative bg-[#FAF9F6] py-24 md:py-32 px-6 sm:px-12 lg:px-24 overflow-hidden">
      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000000 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="max-w-[1400px] mx-auto text-center relative z-10">
        {/* Header - Staggered Slide Up */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20 font-sans"
        >
          <h4 className="text-[0.625rem] font-bold tracking-[0.3em] text-[#3D2B1F]/50 uppercase mb-4">
            Valle Studio Team
          </h4>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1a1a1a]">
            Crafted by <span className="italic font-normal text-[#3D2B1F]/70">calm hands</span>
          </h2>
        </motion.div>

        {/* Team Grid - Staggered Entry Animation */}
        <div className="max-w-[1250px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            {team.map((member, index) => (
              <motion.div 
                key={member.name} 
                className="flex flex-col group items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15, // Staggered entrance timing
                  ease: "easeOut" 
                }}
              >
                <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-8 bg-white shadow-xl shadow-gray-200/50 transition-transform duration-500 group-hover:scale-[1.01]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="space-y-2 font-sans">
                  <h3 className="text-xl font-bold text-[#1a1a1a] tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
