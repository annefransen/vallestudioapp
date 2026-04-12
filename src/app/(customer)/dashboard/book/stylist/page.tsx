"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Scissors, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import {
  useCustomerBooking,
  type StylistItem,
} from "@/contexts/CustomerBookingContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BookStylistSkeleton } from "@/components/ui/Skeletons";
import { BookingProgressBar } from "@/components/ui/BookingProgressBar";

type DBStylist = {
  staff_id: string;
  first_name: string;
  last_name: string;
  specialty: string | null;
};

const ANY_STYLIST: StylistItem = {
  id: "any",
  name: "Any Available Stylist",
  specialty: "We'll assign the best available stylist for you",
};

export default function CustomerBookStep2Stylist() {
  const router = useRouter();
  const { selectedServices, selectedStylist, setStylist, setIsPageLoading } =
    useCustomerBooking();
  const [stylists, setStylists] = useState<StylistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (selectedServices.length === 0) {
      router.replace("/dashboard/book");
      return;
    }
    async function fetch() {
      const { data } = await supabase
        .from("staff")
        .select("staff_id, first_name, last_name, specialty")
        .in("status", ["active", "Active"])
        .order("first_name");
      const mapped: StylistItem[] = (data ?? []).map((s: DBStylist) => ({
        id: s.staff_id,
        name: `${s.first_name} ${s.last_name}`,
        specialty: s.specialty,
      }));
      setStylists(mapped);
      setLoading(false);
    }
    fetch();
  }, [selectedServices, supabase, router]);

  // Sync loading state to layout context
  useEffect(() => {
    setIsPageLoading(loading);
    return () => setIsPageLoading(false);
  }, [loading, setIsPageLoading]);

  const handleNext = () => {
    if (!selectedStylist) {
      toast.error("Please select a stylist or choose 'Any Available'");
      return;
    }
    router.push("/dashboard/book/datetime");
  };

  if (selectedServices.length === 0) return null;
  if (loading) return <BookStylistSkeleton />;

  const allOptions = [ANY_STYLIST, ...stylists];

  return (
    <div className="max-w-6xl mx-auto pb-36 mt-8 px-6 sm:px-0">
      <BookingProgressBar />
      
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#1a1a1a] tracking-tight">
          Select Your Stylist
        </h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Choose who you'd like to work with
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {allOptions.map((stylist) => {
            const isSelected = selectedStylist?.id === stylist.id;
            const isAny = stylist.id === "any";
            const initials = stylist.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <button
                key={stylist.id}
                onClick={() => setStylist(stylist)}
                className={cn(
                  "group w-full text-left p-5 rounded-xl border transition-all duration-150 cursor-pointer",
                  isSelected
                    ? "border-[#494136] bg-[#494136]/5 ring-1 ring-[#494136]/20"
                    : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm",
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold",
                      isAny
                        ? "bg-stone-100 text-stone-500"
                        : isSelected
                          ? "bg-[#494136] text-white"
                          : "bg-stone-100 text-stone-600 group-hover:bg-[#494136]/10 group-hover:text-[#494136] transition-colors",
                    )}
                  >
                    {isAny ? <Scissors className="w-5 h-5" /> : initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-[#1a1a1a] leading-tight truncate">
                        {stylist.name}
                      </p>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#494136] flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    {stylist.specialty && (
                      <p className="text-xs text-stone-500 mt-1 leading-snug">
                        {stylist.specialty}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-5 border-t border-stone-200">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/book")}
          className="border-stone-200 hover:bg-stone-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Services
        </Button>
        <Button
          onClick={handleNext}
          className="bg-[#494136] hover:bg-[#3a342c] text-white border-0 cursor-pointer"
        >
          Next: Date & Time
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
