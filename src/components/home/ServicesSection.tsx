// SERVIVE SECTION

"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

import { createClient } from "@/lib/supabase/client";
import { Loader2, Tag, RefreshCw, Sparkles } from "lucide-react";
import { ServiceDetailModal } from "./ServiceDetailModal";

type Service = {
  id: string;
  name: string;
  price: number | null;
  description: string;
  duration: string | null;
  status: string;
};

export function ServicesSection() {
  const [activeTab, setActiveTab] = useState<"services" | "promos">("services");
  const [currentPage, setCurrentPage] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [promos, setPromos] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 12;
  const supabase = createClient();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, promosRes] = await Promise.all([
          supabase
            .from("services")
            .select("*")
            .eq("status", "available")
            .order("service_name"),
          supabase
            .from("promos")
            .select("*")
            .eq("status", "active")
            .order("name"),
        ]);

        if (servicesRes.error) {
          console.error("Services fetch error:", servicesRes.error);
          throw servicesRes.error;
        }
        if (promosRes.error) {
          console.error("Promos fetch error:", promosRes.error);
          throw promosRes.error;
        }

        console.log("Services raw data:", servicesRes.data);
        console.log("Promos raw data:", promosRes.data);

        setServices(
          servicesRes.data
            ? servicesRes.data.map((s) => ({
                id: s.service_id,
                name: s.service_name,
                price: s.price,
                description: s.description,
                duration: s.duration,
                status: s.status,
              }))
            : [],
        );

        setPromos(
          promosRes.data
            ? promosRes.data.map((p) => ({
                id: p.promo_id,
                name: (p as any).name || (p as any).promo_name || "",
                price:
                  p.price !== undefined && p.price !== null
                    ? Number(p.price)
                    : null,
                description: p.description,
                duration: p.duration,
                status: p.status,
              }))
            : [],
        );
      } catch (err: any) {
        console.error("Error loading services data:", err.message || err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [supabase]);

  const activeItems = activeTab === "services" ? services : promos;
  const totalItems = activeItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const paginatedItems = activeItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const formatDuration = (duration: string | null) => {
    if (!duration) return null;
    const parts = duration.split(":");
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10) || 0;
      const minutes = parseInt(parts[1], 10) || 0;
      const totalMinutes = hours * 60 + minutes;
      return `${totalMinutes} mins`;
    }
    return duration.toLowerCase().includes("min")
      ? duration
      : `${duration} mins`;
  };

  const handleRefresh = () => {
    setLoading(true);
    // This will trigger the effect again because of the supabase client or simple manual reload logic
    window.location.reload();
  };

  return (
    <section
      id="services"
      className="bg-[#f3efee] py-20 md:py-40 px-6 sm:px-12 lg:px-24"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center mb-12 gap-8 md:gap-0">
          <div className="flex justify-start">
            <h2 className="text-5xl md:text-6xl font-sans font-bold tracking-tighter text-[#1a1a1a] select-none cursor-default">
              {activeTab === "services" ? "SERVICES" : "PROMOS"}
            </h2>
          </div>

          <div className="flex justify-center">
            {/* Tab Switcher */}
            <div className="bg-[#f3f3f1] p-1 rounded-full flex gap-1 relative border border-black/5 w-fit h-fit">
              <button
                onClick={() => {
                  setActiveTab("services");
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer",
                  activeTab === "services"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-black",
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
                      : "text-gray-500 hover:text-black",
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

          {!loading && (
            <div className="flex items-center justify-end gap-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cn(
                  "text-2xl font-light transition-all p-2",
                  currentPage === 1
                    ? "text-gray-200 cursor-not-allowed"
                    : "text-[#1a1a1a] hover:opacity-50 cursor-pointer",
                )}
              >
                &lt;
              </button>
              <span className="text-sm font-normal text-gray-500 font-sans tracking-widest select-none cursor-default">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={cn(
                  "text-2xl font-light transition-all p-2",
                  currentPage === totalPages
                    ? "text-gray-200 cursor-not-allowed"
                    : "text-[#1a1a1a] hover:opacity-50 cursor-pointer",
                )}
              >
                &gt;
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#494136]/20" />
            <p className="text-sm font-medium text-gray-400 tracking-widest uppercase">
              Loading {activeTab}...
            </p>
          </div>
        ) : activeItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 border-2 border-dashed border-black/5 rounded-[2rem] bg-white/50 backdrop-blur-sm shadow-inner">
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
              {activeTab === "services" ? (
                <Sparkles className="w-10 h-10 text-muted-foreground/40" />
              ) : (
                <Tag className="w-10 h-10 text-muted-foreground/40" />
              )}
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-bold text-gray-800 tracking-tight">
                No {activeTab} found
              </p>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                We couldn't find any{" "}
                {activeTab === "services"
                  ? "available services"
                  : "active promotions"}{" "}
                at the moment.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="px-8 py-3 bg-[#494136] text-white rounded-full text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-black/10 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
            {paginatedItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="group flex flex-col bg-white rounded-md p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full relative overflow-hidden"
              >
                <div className="flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-[#1a1a1a] font-sans leading-tight mb-2 group-hover:text-[#494136] transition-colors">
                    {item.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold text-[#1a1a1a] font-sans tracking-tight">
                    {item.price !== null &&
                    item.price !== undefined &&
                    item.price > 0 ? (
                      `₱${item.price.toLocaleString()}`
                    ) : (
                      <span className="text-sm font-medium text-gray-400 italic">
                        Check details
                      </span>
                    )}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedService(item);
                      setIsModalOpen(true);
                    }}
                    className="w-10 h-10 rounded-full bg-[#f3efee] flex items-center justify-center group-hover:bg-[#494136] group-hover:text-white transition-all duration-300 cursor-pointer outline-none"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#494136]/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              </div>
            ))}
          </div>
        )}
      </div>

      <ServiceDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
        formatDuration={formatDuration}
      />
    </section>
  );
}
