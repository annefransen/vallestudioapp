"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { useBooking } from "@/contexts/BookingContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Generate time slots: 9:30 AM → 7:00 PM in 30-min intervals
function generateTimeSlots(
  date: Date | null,
): { time: string; available: boolean }[] {
  if (!date) return [];

  // 9:30, 10:00, 10:30 … 19:00
  const slots: { time: string; available: boolean }[] = [];
  const seed = date.getDate() + date.getMonth();

  // Start at 9:30 (570 minutes from midnight), end at 19:00 (1140 minutes)
  for (let minutes = 570; minutes <= 1140; minutes += 30) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const displayM = m === 0 ? "00" : "30";
    const timeStr = `${displayH}:${displayM} ${period}`;

    // Logic: 90% availability for demo, and check if time has passed for today
    const now = new Date();
    const isToday =
      date &&
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    let isPast = false;
    if (isToday) {
      const slotHour = h;
      const slotMin = m;
      const nowHour = now.getHours();
      const nowMin = now.getMinutes();
      if (slotHour < nowHour || (slotHour === nowHour && slotMin <= nowMin)) {
        isPast = true;
      }
    }

    // Mock availability logic: In a real app, this would check a database.
    // Making 100% of future slots available for testing.
    const isRandomlyBooked = false;

    const available = !isPast && !isRandomlyBooked;

    slots.push({ time: timeStr, available });
  }
  return slots;
}

export default function DateTimeSelectionPage() {
  const router = useRouter();
  const { selectedDate, selectedTime, setDate, setTime, selectedServices } =
    useBooking();
  const [timeSlots, setTimeSlots] = useState<
    { time: string; available: boolean }[]
  >([]);

  useEffect(() => {
    if (selectedServices.length === 0) {
      router.replace("/book/services");
    }
  }, [selectedServices, router]);

  useEffect(() => {
    setTimeSlots(generateTimeSlots(selectedDate));
    setTime(null);
  }, [selectedDate, setTime]);

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date ?? null);
  };

  const handleNext = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    if (!selectedTime) {
      toast.error("Please select a time slot");
      return;
    }
    router.push("/book/guest-info");
  };

  const disabledDays = { before: new Date(new Date().setHours(0, 0, 0, 0)) };

  if (selectedServices.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto font-sans px-4 sm:px-6">
      {/* HEADER */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-2 tracking-tight text-[#1a1a1a]">
          Select Date & Time
        </h2>
        <p className="text-sm text-gray-500 font-medium">
          Choose your preferred appointment date and time
        </p>
      </div>

      {/* MAIN SPLIT LAYOUT - CENTERED */}
      <div className="flex flex-col lg:flex-row gap-10 items-start justify-center max-w-full mx-auto">
        {/* ── LEFT: CALENDAR ── */}
        <div className="flex flex-col rounded-sm bg-white shadow-sm overflow-hidden border border-[#efecea]">
          <div className="p-12 flex-1 flex items-center ">
            <Calendar
              mode="single"
              selected={selectedDate ?? undefined}
              onSelect={handleDateSelect}
              disabled={disabledDays}
              initialFocus
              className="w-full h-full "
            />
          </div>
        </div>

        {/* ── RIGHT: TIME SLOTS ── */}
        <div className="flex-1 max-w-[400px]">
          {!selectedDate ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-100 rounded-sm">
              <Clock className="w-8 h-8 text-gray-200 mb-4" />
              <p className="text-sm font-medium text-gray-400">
                Please select a date on the calendar to see available time slots
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {timeSlots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                const isBooked = !slot.available;

                return (
                  <button
                    key={slot.time}
                    disabled={isBooked}
                    onClick={() => setTime(slot.time)}
                    className={[
                      "relative px-2 py-3 rounded-sm text-xs font-semibold transition-all duration-200 focus:outline-none cursor-pointer",
                      isBooked
                        ? "bg-[#e5e7eb] text-gray-500 cursor-not-allowed"
                        : isSelected
                          ? "bg-[#494136] text-white shadow-md scale-[1.02]"
                          : "bg-[#efecea] text-[#494136] hover:bg-[#494136]/10 hover:text-[#494136] border border-gray-100 hover:border-[#494136]/20",
                    ].join(" ")}
                  >
                    {slot.time}
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#7c6b5a] border-2 border-white" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* SELECTED SUMMARY PILL - CENTERED */}
      {selectedDate && selectedTime && (
        <div className="mt-5 flex items-center gap-3 px-4 py-3 rounded-sm bg-[#494136]/8 border border-[#494136]/15">
          <Clock className="w-4 h-4 text-[#494136] shrink-0" />
          <span className="text-sm font-semibold text-[#494136]">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            at{" "}
            <span className="text-[#494136] underline decoration-2 underline-offset-4">
              {selectedTime}
            </span>
          </span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-7 mt-7 border-t border-gray-200/70">
        <Button
          variant="outline"
          className="w-full sm:w-auto font-semibold cursor-pointer"
          onClick={() => router.push("/book/services")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>
        <Button
          size="lg"
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
          className="w-full sm:w-auto font-semibold bg-[#494136] hover:bg-[#3a342c] text-white disabled:opacity-40 transition-all cursor-pointer"
        >
          Next: Guest Info
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
