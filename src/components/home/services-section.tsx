"use client";

import React from "react";

type Service = {
  name: string;
  price: string;
  description: string;
  duration?: string;
};

type Category = {
  title: string;
  services: Service[];
};

const allCategories: Category[] = [
  {
    title: "HAIR",
    services: [
      {
        name: "Hair Cut w/ Blow Dry",
        price: "149",
        description:
          "Basic haircut followed by blow drying for a clean finish.",
        duration: "30 mins",
      },
      {
        name: "Hair Wash / Dry & Cut",
        price: "199",
        description: "Hair washing, haircut, and blow dry styling.",
        duration: "40 mins",
      },
      {
        name: "Hair Spa + Cut",
        price: "299",
        description: "Deep conditioning hair treatment with relaxing haircut.",
        duration: "60 mins",
      },
      {
        name: "Hair Color",
        price: "599 UP",
        description: "Full hair coloring to refresh or change hair shade.",
        duration: "90 mins",
      },
      {
        name: "Highlights",
        price: "799",
        description:
          "Selected strands are colored to add dimension to the hair.",
        duration: "120 mins",
      },
      {
        name: "Balayage",
        price: "1699",
        description:
          "Hand-painted hair color technique for natural gradient effect.",
        duration: "180 mins",
      },
      {
        name: "Rebond",
        price: "899",
        description: "Chemical hair straightening for smooth and sleek hair.",
        duration: "180 mins",
      },
      {
        name: "Regular Keratin",
        price: "499 UP",
        description: "Keratin treatment to reduce frizz and add shine.",
        duration: "120 mins",
      },
      {
        name: "Brazilian Blow-out",
        price: "899 UP",
        description:
          "Professional smoothing treatment for shiny, frizz-free hair.",
        duration: "120 mins",
      },
    ],
  },
  {
    title: "", // HAIR PROMO
    services: [
      {
        name: "Rebond + Color",
        price: "1499",
        description: "Hair rebonding with full hair color treatment.",
        duration: "240 mins",
      },
      {
        name: "Rebond + Color + Brazilian",
        price: "2499",
        description:
          "Rebonding with hair color plus Brazilian smoothing treatment.",
        duration: "300 mins",
      },
      {
        name: "Rebond + Color + Cysteine",
        price: "2799",
        description:
          "Hair rebonding with color and cysteine smoothing treatment.",
        duration: "300 mins",
      },
      {
        name: "Rebond + Botox",
        price: "1999",
        description: "Rebonding combined with hair botox repair treatment.",
        duration: "240 mins",
      },
      {
        name: "Hair Color + Brazilian",
        price: "1499",
        description: "Hair coloring with Brazilian smoothing treatment.",
        duration: "210 mins",
      },
      {
        name: "Balayage + Cysteine",
        price: "3099",
        description: "Balayage coloring with cysteine smoothing treatment.",
        duration: "240 mins",
      },
    ],
  },
  {
    title: "NAILS",
    services: [
      {
        name: "Manicure",
        price: "119",
        description: "Nail trimming, shaping, cuticle care, and polish.",
        duration: "30 mins",
      },
      {
        name: "Pedicure",
        price: "139",
        description: "Foot nail cleaning, shaping, and polish application.",
        duration: "35 mins",
      },
      {
        name: "Foot Spa",
        price: "149",
        description: "Relaxing foot soak with exfoliation and massage.",
        duration: "40 mins",
      },
      {
        name: "Foot Spa Gel-O",
        price: "249",
        description: "Foot spa treatment with gel polish application.",
        duration: "50 mins",
      },
      {
        name: "Gel Mani/Pedi",
        price: "350",
        description: "Long-lasting gel polish for hands or feet.",
        duration: "45 mins",
      },
      {
        name: "Gel Removal",
        price: "129",
        description: "Safe removal of gel polish without damaging nails.",
        duration: "20 mins",
      },
      {
        name: "Soft Gel",
        price: "700 UP",
        description: "Soft gel nail extensions for longer and durable nails.",
        duration: "90 mins",
      },
    ],
  },
  {
    title: "", // NAILS PROMOS
    services: [
      {
        name: "Mani + Pedi",
        price: "229",
        description: "Combined manicure and pedicure nail care service.",
        duration: "60 mins",
      },
      {
        name: "Mani + Pedi + Footspa",
        price: "349",
        description: "Manicure, pedicure, and relaxing foot spa treatment.",
        duration: "75 mins",
      },
      {
        name: "Gel Mani + Pedi",
        price: "450",
        description: "Gel manicure and gel pedicure for long-lasting shine.",
        duration: "70 mins",
      },
      {
        name: "Gel Mani / Gel Pedi",
        price: "649",
        description: "Gel manicure or gel pedicure with premium polish finish.",
        duration: "60 mins",
      },
      {
        name: "Gel Mani + Gel Pedi + Footspa",
        price: "799",
        description: "Gel manicure, gel pedicure, and relaxing foot spa.",
        duration: "90 mins",
      },
    ],
  },
  {
    title: "BROW",
    services: [
      {
        name: "Brow Threading",
        price: "100",
        description: "Precise eyebrow shaping using threading technique.",
        duration: "15 min",
      },
    ],
  },
];

export function ServicesSection() {
  const renderCategory = (cat: Category, index: number) => (
    <div key={index} className="mb-20">
      <div className="min-h-[48px] flex items-end mb-6">
        {cat.title && (
          <h3 className="text-xl font-sans font-extrabold tracking-widest text-[#1a1a1a] uppercase border-b border-black/20 pb-2 w-full">
            {cat.title}
          </h3>
        )}
      </div>
      <div className="flex flex-col space-y-6">
        {cat.services.map((service, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex justify-between items-end mb-1">
              <span className="text-base font-bold text-[#1a1a1a] font-sans">
                {service.name}
              </span>
              <span className="text-base font-bold text-[#1a1a1a] font-sans tracking-tight">
                ₱{service.price}
              </span>
            </div>
            {service.description && (
              <p className="text-sm text-gray-500 font-medium leading-snug w-[85%] font-sans">
                {service.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section
      id="services"
      className="bg-[#FAF9F6] pt-12 pb-32 px-6 sm:px-12 lg:px-24"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="text-left mb-16">
          <h2 className="text-5xl md:text-6xl font-sans font-bold tracking-tighter text-[#1a1a1a] mb-6">
            SERVICES
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 xl:gap-x-40 gap-y-12 items-start">
          {allCategories.map((cat, idx) => renderCategory(cat, idx))}
        </div>
      </div>
    </section>
  );
}
