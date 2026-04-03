"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

type Service = {
  name: string;
  price: string;
  description: string;
};

const allServices: Service[] = [
  // HAIR
  {
    name: "Hair Cut w/ Blow Dry",
    price: "149",
    description: "Basic haircut followed by blow drying for a clean finish.",
  },
  {
    name: "Hair Wash / Dry & Cut",
    price: "199",
    description: "Hair washing, haircut, and blow dry styling.",
  },
  {
    name: "Hair Spa + Cut",
    price: "299",
    description: "Deep conditioning hair treatment with relaxing haircut.",
  },
  {
    name: "Hair Color",
    price: "599 UP",
    description: "Full hair coloring to refresh or change hair shade.",
  },
  {
    name: "Highlights",
    price: "799",
    description: "Selected strands are colored to add dimension to the hair.",
  },
  {
    name: "Balayage",
    price: "1699",
    description: "Hand-painted hair color technique for natural gradient effect.",
  },
  {
    name: "Rebond",
    price: "899",
    description: "Chemical hair straightening for smooth and sleek hair.",
  },
  {
    name: "Regular Keratin",
    price: "499 UP",
    description: "Keratin treatment to reduce frizz and add shine.",
  },
  {
    name: "Brazilian Blow-out",
    price: "899 UP",
    description: "Professional smoothing treatment for shiny, frizz-free hair.",
  },
  // NAILS
  {
    name: "Manicure",
    price: "119",
    description: "Nail trimming, shaping, cuticle care, and polish.",
  },
  {
    name: "Pedicure",
    price: "139",
    description: "Foot nail cleaning, shaping, and polish application.",
  },
  {
    name: "Foot Spa",
    price: "149",
    description: "Relaxing foot soak with exfoliation and massage.",
  },
  {
    name: "Foot Spa Gel-O",
    price: "249",
    description: "Foot spa treatment with gel polish application.",
  },
  {
    name: "Gel Mani/Pedi",
    price: "350",
    description: "Long-lasting gel polish for hands or feet.",
  },
  {
    name: "Gel Removal",
    price: "129",
    description: "Safe removal of gel polish without damaging nails.",
  },
  {
    name: "Soft Gel",
    price: "700 UP",
    description: "Soft gel nail extensions for longer and durable nails.",
  },
  {
    name: "Brow Threading",
    price: "100",
    description: "Precise eyebrow shaping using threading technique.",
  },
];

const allPromos: Service[] = [
  // HAIR PROMOS
  {
    name: "Rebond + Color",
    price: "1499",
    description: "Hair rebonding with full hair color treatment.",
  },
  {
    name: "Rebond + Color + Brazilian",
    price: "2499",
    description: "Rebonding with hair color plus Brazilian smoothing treatment.",
  },
  {
    name: "Rebond + Color + Cysteine",
    price: "2799",
    description: "Hair rebonding with color and cysteine smoothing treatment.",
  },
  {
    name: "Rebond + Botox",
    price: "1999",
    description: "Rebonding combined with hair botox repair treatment.",
  },
  {
    name: "Hair Color + Brazilian",
    price: "1499",
    description: "Hair coloring with Brazilian smoothing treatment.",
  },
  {
    name: "Balayage + Cysteine",
    price: "3099",
    description: "Balayage coloring with cysteine smoothing treatment.",
  },
  // NAIL PROMOS
  {
    name: "Mani + Pedi",
    price: "229",
    description: "Combined manicure and pedicure nail care service.",
  },
  {
    name: "Mani + Pedi + Footspa",
    price: "349",
    description: "Manicure, pedicure, and relaxing foot spa treatment.",
  },
  {
    name: "Gel Mani + Pedi",
    price: "450",
    description: "Gel manicure and gel pedicure for long-lasting shine.",
  },
  {
    name: "Gel Mani / Gel Pedi",
    price: "649",
    description: "Gel manicure or gel pedicure with premium polish finish.",
  },
  {
    name: "Gel Mani + Gel Pedi + Footspa",
    price: "799",
    description: "Gel manicure, gel pedicure, and relaxing foot spa.",
  },
];

export function ServicesSection() {
  const [activeTab, setActiveTab] = useState<"services" | "promos">("services");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const activeItems = activeTab === "services" ? allServices : allPromos;
  const totalPages = Math.ceil(activeItems.length / itemsPerPage);

  const paginatedItems = activeItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Split into columns for vertical flow (6 per side)
  const leftColumn = paginatedItems.slice(0, 6);
  const rightColumn = paginatedItems.slice(6, 12);

  return (
    <section
      id="services"
      className="bg-[#f3efee] py-20 md:py-24 px-6 sm:px-12 lg:px-24"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-center mb-10">
          <div className="bg-[#f3f3f1] p-1 rounded-full flex gap-1 relative border border-black/5">
            <button
              onClick={() => {
                setActiveTab("services");
                setCurrentPage(1);
              }}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer",
                activeTab === "services"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-black"
              )}
            >
              Services
            </button>
            <div className="relative">
              <button
                onClick={() => {
                  setActiveTab("promos");
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-1 cursor-pointer",
                  activeTab === "promos"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-black"
                )}
              >
                Promos
              </button>
              {/* Star Icon */}
              <div className="absolute -top-3 -right-3 pointer-events-none scale-125">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="#f5c518"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2v4a6 6 0 0 0 6 6h4a6 6 0 0 0-6 6v4a6 6 0 0 0-6-6H6a6 6 0 0 0 6-6V2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <h2 className="text-5xl md:text-6xl font-sans font-bold tracking-tighter text-[#1a1a1a] select-none cursor-default">
            {activeTab === "services" ? "SERVICES" : "PROMOS"}
          </h2>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={cn(
                "text-2xl font-light transition-all p-2",
                currentPage === 1
                  ? "text-gray-200 cursor-not-allowed"
                  : "text-[#1a1a1a] hover:opacity-50 cursor-pointer"
              )}
            >
              &lt;
            </button>
            <span className="text-sm font-normal text-gray-500 font-sans tracking-widest select-none cursor-default">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                "text-2xl font-light transition-all p-2",
                currentPage === totalPages
                  ? "text-gray-200 cursor-not-allowed"
                  : "text-[#1a1a1a] hover:opacity-50 cursor-pointer"
              )}
            >
              &gt;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 xl:gap-x-40 items-start min-h-[480px]">
          {/* Left Column (Items 1-6) */}
          <div className="flex flex-col gap-y-12">
            {leftColumn.map((service, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex justify-between items-end mb-1 select-none cursor-default">
                  <span className="text-[17px] md:text-lg font-bold text-[#1a1a1a] font-sans">
                    {service.name}
                  </span>
                  <span className="text-[17px] md:text-lg font-bold text-[#1a1a1a] font-sans tracking-tight">
                    ₱{service.price}
                  </span>
                </div>
                {service.description && (
                  <p className="text-[15px] text-gray-500 font-medium leading-snug w-[85%] font-sans select-none cursor-default">
                    {service.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Right Column (Items 7-12) */}
          <div className="flex flex-col gap-y-12">
            {rightColumn.map((service, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex justify-between items-end mb-1 select-none cursor-default">
                  <span className="text-[17px] md:text-lg font-bold text-[#1a1a1a] font-sans">
                    {service.name}
                  </span>
                  <span className="text-[17px] md:text-lg font-bold text-[#1a1a1a] font-sans tracking-tight">
                    ₱{service.price}
                  </span>
                </div>
                {service.description && (
                  <p className="text-[15px] text-gray-500 font-medium leading-snug w-[85%] font-sans select-none cursor-default">
                    {service.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
