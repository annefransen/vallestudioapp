"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  useCustomerBooking,
  type ServiceItem,
} from "@/contexts/CustomerBookingContext";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { BookAppointmentSkeleton } from "@/components/ui/Skeletons";
import { BookingProgressBar } from "@/components/ui/BookingProgressBar";

const CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "hair", label: "Hair" },
  { id: "nails", label: "Nails" },
  { id: "brows", label: "Brows" },
] as const;
type CategoryId = (typeof CATEGORIES)[number]["id"];

function parseDuration(d: string | null): number {
  if (!d) return 30;
  const parts = d.split(":");
  if (parts.length >= 2)
    return (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);
  return parseInt(d) || 30;
}

export default function CustomerBookStep1Services() {
  const router = useRouter();
  const {
    selectedServices,
    addService,
    removeService,
    getTotalPrice,
    getTotalDuration,
    setIsPageLoading,
  } = useCustomerBooking();

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
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

        if (servicesRes.error) throw servicesRes.error;
        if (promosRes.error) throw promosRes.error;

        const mappedServices: ServiceItem[] = (servicesRes.data ?? []).map(
          (s: any) => ({
            id: s.service_id,
            name: s.service_name,
            price: s.price ?? 0,
            duration: parseDuration(s.duration),
            description: s.description ?? "",
            type: "service" as const,
            category: s.category ?? "Hair",
          }),
        );

        const mappedPromos: ServiceItem[] = (promosRes.data ?? []).map(
          (p: any) => ({
            id: p.promo_id,
            name: p.name ?? p.promo_name ?? "Promotion",
            price: p.price ?? 0,
            duration: parseDuration(p.duration),
            description: p.description ?? "",
            type: "promo" as const,
            category: p.category ?? "Hair",
          }),
        );

        setServices([...mappedServices, ...mappedPromos]);
      } catch (err: any) {
        console.error("Error loading services:", err);
        toast.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [supabase]);

  // Sync loading state to layout context
  useEffect(() => {
    setIsPageLoading(loading);
    return () => setIsPageLoading(false);
  }, [loading, setIsPageLoading]);

  const filteredServices = services.filter((s) => {
    const sCat = s.category?.toLowerCase().trim() ?? "";
    const selCat = selectedCategory.toLowerCase().trim();
    return (
      selectedCategory === "all" ||
      sCat === selCat ||
      (selCat === "brows" && sCat.includes("brow")) ||
      (selCat === "hair" && sCat.includes("hair")) ||
      (selCat === "nails" && sCat.includes("nails"))
    );
  });

  const handleNext = () => {
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service");
      return;
    }
    router.push("/dashboard/book/stylist");
  };

  if (loading) return <BookAppointmentSkeleton />;

  return (
    <div className="max-w-6xl mx-auto pb-36 mt-8 px-6 sm:px-0">
      <BookingProgressBar />
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-4xl font-bold mb-3 text-black tracking-tight">
          Select Your Services
        </h2>
        <p className="text-gray-500 font-medium">
          Choose one or more services for your appointment
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-10 flex-wrap justify-center sm:justify-start">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`rounded-[8px] px-5 h-10 transition-all border cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-[#494136] text-white border-black hover:bg-[#494136] shadow-sm"
                : "bg-white text-black border-gray-200 hover:bg-[#494136] hover:text-white"
            }`}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No services found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 min-h-[450px] content-start">
          {filteredServices.map((service) => {
            const isSelected = selectedServices.some(
              (s) => s.id === service.id,
            );
            return (
              <div
                key={service.id}
                onClick={() => {
                  if (isSelected) {
                    removeService(service.id);
                  } else {
                    addService(service);
                  }
                }}
                className={cn(
                  "group flex flex-col bg-white rounded-md p-6 shadow-sm transition-all duration-300 h-full relative overflow-hidden cursor-pointer border-2",
                  isSelected
                    ? "border-[#494136]/10 shadow-xl -translate-y-1 bg-white"
                    : "border-transparent hover:shadow-xl hover:-translate-y-1",
                )}
              >
                <div className="flex flex-col flex-1">
                  <h3
                    className={cn(
                      "text-lg font-bold font-sans leading-tight transition-colors mb-4",
                      isSelected
                        ? "text-black"
                        : "text-[#1a1a1a] group-hover:text-[#494136]",
                    )}
                  >
                    {service.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold text-[#1a1a1a] font-sans tracking-tight">
                    ₱{service.price.toLocaleString()}
                  </span>
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                      isSelected
                        ? "bg-[#494136] text-white"
                        : "bg-[#f3efee] group-hover:bg-[#494136] group-hover:text-white",
                    )}
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
                  </div>
                </div>

                {/* Decorative */}
                <div
                  className={cn(
                    "absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#494136]/5 to-transparent rounded-full -mr-16 -mt-16 transition-transform duration-700 pointer-events-none",
                    isSelected
                      ? "scale-150 rotate-90"
                      : "group-hover:scale-150",
                  )}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky Summary Footer */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 md:left-64 flex justify-center px-4 z-50 pointer-events-none">
          <Card className="w-full max-w-7xl shadow-2xl animate-in slide-in-from-bottom-6 border-t font-medium pointer-events-auto">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="w-full overflow-hidden">
                  <h3 className="font-semibold mb-2">
                    Selected Services ({selectedServices.length})
                  </h3>
                  <div className="flex gap-2 flex-wrap mb-3 max-h-[80px] overflow-y-auto w-full scrollbar-hide">
                    {selectedServices.map((service) => (
                      <Badge
                        key={service.id}
                        variant="secondary"
                        className="gap-1 flex items-center cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors"
                        onClick={() => removeService(service.id)}
                      >
                        <span className="font-medium">{service.name}</span>
                        <X className="w-3 h-3 text-gray-400" />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-4 text-sm font-medium text-foreground">
                    <p>Total: ₱{getTotalPrice().toLocaleString()}</p>
                    <p className="text-gray-500">{getTotalDuration()} mins</p>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={handleNext}
                  className="w-full sm:w-auto shrink-0 bg-black text-white hover:bg-black/90 cursor-pointer"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
