"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { useCustomerBooking } from "@/contexts/CustomerBookingContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BookingProgressBar } from "@/components/ui/BookingProgressBar";

function generateTimeSlots(
  date: Date | null,
): { time: string; available: boolean }[] {
  if (!date) return [];
  const slots: { time: string; available: boolean }[] = [];
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  for (let minutes = 570; minutes <= 1140; minutes += 30) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const timeStr = `${displayH}:${m === 0 ? "00" : "30"} ${period}`;

    let isPast = false;
    if (isToday) {
      if (h < now.getHours() || (h === now.getHours() && m <= now.getMinutes()))
        isPast = true;
    }

    slots.push({ time: timeStr, available: !isPast });
  }
  return slots;
}

export default function CustomerBookStep3DateTime() {
  const router = useRouter();
  const {
    selectedServices,
    selectedStylist,
    selectedDate,
    selectedTime,
    setDate,
    setTime,
  } = useCustomerBooking();
  const [timeSlots, setTimeSlots] = useState<
    { time: string; available: boolean }[]
  >([]);

  useEffect(() => {
    if (selectedServices.length === 0) {
      router.replace("/dashboard/book");
    }
  }, [selectedServices, router]);

  useEffect(() => {
    setTimeSlots(generateTimeSlots(selectedDate));
    setTime(null);
  }, [selectedDate, setTime]);

  const handleNext = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    if (!selectedTime) {
      toast.error("Please select a time slot");
      return;
    }
    router.push("/dashboard/book/info");
  };

  const disabledDays = { before: new Date(new Date().setHours(0, 0, 0, 0)) };

  if (selectedServices.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto pb-36 mt-8 px-6 sm:px-0">
      <BookingProgressBar />

      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#1a1a1a] tracking-tight">
          Select Date & Time
        </h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Choose your preferred appointment date and time
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Calendar */}
        <div className="rounded-xl bg-white shadow-sm overflow-hidden border border-stone-200">
          <div className="p-8">
            <Calendar
              mode="single"
              selected={selectedDate ?? undefined}
              onSelect={(d) => setDate(d ?? null)}
              disabled={disabledDays}
              initialFocus
            />
          </div>
        </div>

        {/* Time Slots */}
        <div className="flex-1">
          {!selectedDate ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-stone-200 rounded-xl min-h-[200px]">
              <Clock className="w-8 h-8 text-stone-300 mb-3" />
              <p className="text-sm text-stone-400 font-medium">
                Select a date to see available time slots
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">
                Available Times
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTime === slot.time;
                  const isBooked = !slot.available;
                  return (
                    <button
                      key={slot.time}
                      disabled={isBooked}
                      onClick={() => setTime(slot.time)}
                      className={cn(
                        "px-2 py-3 rounded-lg text-xs font-semibold transition-all duration-150 focus:outline-none",
                        isBooked
                          ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                          : isSelected
                            ? "bg-[#494136] text-white shadow-sm cursor-pointer"
                            : "bg-stone-50 text-stone-700 border border-stone-200 hover:border-stone-300 hover:bg-stone-100 cursor-pointer",
                      )}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Selected Summary */}
      {selectedDate && selectedTime && (
        <div className="mt-5 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#494136]/5 border border-[#494136]/15">
          <Clock className="w-4 h-4 text-[#494136] shrink-0" />
          <span className="text-sm font-semibold text-[#494136]">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            at{" "}
            <span className="underline decoration-2 underline-offset-4">
              {selectedTime}
            </span>
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 mt-6 border-t border-stone-200">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/book/stylist")}
          className="border-stone-200 hover:bg-stone-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Stylist
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
          className="bg-[#494136] hover:bg-[#3a342c] text-white border-0 disabled:opacity-40 cursor-pointer"
        >
          Next: Your Info
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
