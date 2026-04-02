import React from "react";
import Image from "next/image";

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
    <section id="team" className="bg-[#f7f8f9] py-32 px-6 sm:px-12 lg:px-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-sans font-bold tracking-tight text-[#1a1a1a] mb-4">
            MEET THE TEAM
          </h2>
          <p className="text-gray-500 font-sans max-w-lg mx-auto">
            The talented professionals behind your best look.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {team.map((member) => (
            <div 
              key={member.name} 
              className="bg-white rounded-[2rem] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col group transition-transform duration-300 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative w-full h-[350px] overflow-hidden rounded-[1.5rem] mb-6 bg-gray-100 shrink-0">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Text Layout */}
              <div className="w-full px-4 pb-4 flex flex-col h-full flex-1">
                <div className="mb-6">
                  <h3 className="text-2xl font-sans font-bold text-[#1a1a1a] tracking-tight mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 leading-relaxed">
                    {member.role}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-end pt-4 border-t border-gray-100 mt-auto w-full">
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-1">
                    Book <span className="text-lg leading-none">+</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
