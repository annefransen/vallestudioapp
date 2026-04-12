// SERVICE MODAL

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Tag, ChevronRight } from "lucide-react";
import { GetStartedButton } from "@/components/ui/BookNowButton";
import Link from "next/link";

type Service = {
  id: string;
  name: string;
  price: number | null;
  description: string;
  duration: string | null;
  status: string;
};

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  formatDuration: (duration: string | null) => string | null;
  onSelect?: (service: any) => void;
  isSelected?: boolean;
}

const SERVICE_IMAGES: Record<string, string> = {
  balayage:
    "https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=1200&auto=format&fit=crop",
  brazilian:
    "https://images.unsplash.com/photo-1560869713-7d0a294308?q=80&w=1200&auto=format&fit=crop",
  brow: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop",
  foot: "https://images.unsplash.com/photo-1519415510236-85592ac59cfa?q=80&w=1200&auto=format&fit=crop",
  gel: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1200&auto=format&fit=crop",
  "hair color":
    "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1200&auto=format&fit=crop",
  "hair cut":
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1200&auto=format&fit=crop",
  highlights:
    "https://images.unsplash.com/photo-1527799822367-a05eb57c23f6?q=80&w=1200&auto=format&fit=crop",
  default:
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop",
};

const getServiceImage = (name: string = "") => {
  const lowerName = name.toLowerCase();
  for (const key in SERVICE_IMAGES) {
    if (lowerName.includes(key) && key !== "default")
      return SERVICE_IMAGES[key];
  }
  return SERVICE_IMAGES.default;
};

export function ServiceDetailModal({
  isOpen,
  onClose,
  service,
  formatDuration,
  onSelect,
  isSelected,
}: ServiceDetailModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0f0a05]/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-white rounded-[1rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-8 z-10 w-12 h-12 rounded-full flex items-center justify-center text-[#494136] transition-all hover:rotate-90 cursor-pointer border-none outline-none focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Side: Image */}
            <div className="w-full md:w-1/2 h-80 md:h-auto relative overflow-hidden">
              <img
                src={getServiceImage(service.name)}
                alt={service.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Right Side: Details */}
            <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col relative">
              <div className="space-y-8 mb-auto">
                <div className="space-y-4">
                  {/* Service Name */}
                  <h2 className="text-4xl md:text-5xl font-sans font-bold text-[#1a1a1a] tracking-tight leading-tight">
                    {service.name}
                  </h2>

                  {/* Price */}
                  <div>
                    <span className="text-3xl font-bold text-[#494136]">
                      {service.price !== null && service.price > 0
                        ? `₱${service.price.toLocaleString()}`
                        : "Check details"}
                    </span>
                  </div>
                </div>

                {/* Description Block */}
                <div className="space-y-3">
                  <span className="text-[12px] font-semibold tracking-widest text-[#494136]">
                    Description
                  </span>
                  <p className="text-[#494136] text-lg leading-relaxed font-sans max-w-lg mt-2">
                    {service.description ||
                      "Indulge in our premium service tailored to bring out your natural beauty. Our expert stylists ensure a relaxing experience with professional results."}
                  </p>
                </div>
              </div>

              {/* Pinned Bottom Action with Duration */}
              <div className="absolute bottom-12 left-10 md:left-16 right-10 md:right-16 flex items-center justify-between">
                {/* Duration */}
                <div className="space-y-1">
                  <span className="text-[12px] font-semibold tracking-widest text-[#494136]">
                    Duration
                  </span>
                  <div className="flex items-center gap-2 text-[#494136]">
                    <Clock className="w-3 h-3" />
                    <span className="text-base font-medium">
                      {formatDuration(service.duration)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 right-10">
                {onSelect ? (
                  <button
                    onClick={() => {
                      onSelect(service);
                      onClose();
                    }}
                    className="cursor-pointer group relative overflow-hidden h-11 px-7 rounded-sm bg-[#2e2721] hover:bg-[#2A1D15] text-white border-none transition-all shadow-md flex items-center"
                  >
                    <span className="mr-7 transition-opacity duration-500 group-hover:opacity-0 font-bold tracking-widest text-xs uppercase">
                      {isSelected ? "Remove Service" : "Select Service"}
                    </span>
                    <i className="absolute right-1 top-1 bottom-1 rounded-md z-10 grid w-10 place-items-center transition-all duration-500 bg-white/10 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-white">
                      <ChevronRight
                        size={18}
                        strokeWidth={2.5}
                        aria-hidden="true"
                        className="transition-transform duration-500 group-hover:translate-x-1"
                      />
                    </i>
                  </button>
                ) : (
                  <Link href="/register">
                    <GetStartedButton />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
