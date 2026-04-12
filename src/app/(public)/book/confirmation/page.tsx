"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Home, Calendar, Clock, Scissors, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useBooking } from "@/contexts/BookingContext";

export default function ConfirmationPage() {
  const {
    selectedServices,
    selectedDate,
    selectedTime,
    getTotalPrice,
    resetBooking,
  } = useBooking();
  const router = useRouter();
  const [ticketId, setTicketId] = useState("");

  useEffect(() => {
    if (selectedServices.length === 0) {
      router.replace("/book/services");
    }
  }, [selectedServices, router]);

  useEffect(() => {
    if (selectedServices.length > 0) {
      const randomString = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      setTicketId(`VS-${randomString}`);
    }
  }, [selectedServices]);

  const handleNewBooking = () => {
    resetBooking();
    router.replace("/book/services");
  };

  const handleHome = () => {
    resetBooking();
    router.replace("/");
  };

  if (selectedServices.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto font-sans pb-20">
      {/* Success Animation Area */}
      <div className="text-center mb-10 pt-4">
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute inset-0 bg-[#494136]/5 rounded-full scale-150 animate-pulse" />
          <div className="relative w-24 h-24 bg-[#494136] rounded-full flex items-center justify-center shadow-xl shadow-[#494136]/20 ring-8 ring-white">
            <CheckCircle className="w-12 h-12 text-white stroke-[2.5]" />
          </div>
        </div>
        <h2 className="text-3xl font-black mb-2 tracking-tight text-[#1a1a1a]">
          Booking Confirmed!
        </h2>
        <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto">
          Your appointment at Valle Studio has been successfully scheduled. We
          can&apos;t wait to see you!
        </p>
      </div>

      {/* Main Ticket Card */}
      <Card className="mb-8 border-gray-200/80 bg-white shadow-xl shadow-black/5 rounded-[2rem] overflow-hidden">
        <CardContent className="p-0">
          {/* Reference Bar */}
          <div className="bg-[#494136] px-8 py-5 text-center">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1">
              Booking Reference
            </p>
            <p className="text-2xl font-black text-white tracking-widest leading-none">
              {ticketId}
            </p>
          </div>

          <div className="p-8 space-y-8">
            {/* Split Details */}
            <div className="grid grid-cols-2 gap-8 border-b border-gray-100 pb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Calendar className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Date
                  </span>
                </div>
                <p className="text-sm font-black text-[#1a1a1a]">
                  {selectedDate?.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Time
                  </span>
                </div>
                <p className="text-sm font-black text-[#1a1a1a]">
                  {selectedTime}
                </p>
              </div>
            </div>

            {/* Services List */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Services
                </span>
              </div>
              <div className="space-y-3">
                {selectedServices.map((service) => (
                  <div key={service.id} className="flex justify-between items-center group">
                    <span className="text-sm font-bold text-[#1a1a1a]">
                      {service.name}
                    </span>
                    <span className="text-sm font-black text-[#494136]">
                      ₱{service.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Footer */}
            <div className="pt-6 mt-4 border-t-2 border-dashed border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400">Total Paid</span>
                <span className="text-2xl font-black text-[#494136]">
                  ₱{getTotalPrice()}
                </span>
              </div>
            </div>

            {/* Reminder */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div className="flex gap-3">
                <div className="size-5 bg-[#494136]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <div className="size-1.5 bg-[#494136] rounded-full" />
                </div>
                <div className="text-[11px] font-medium leading-relaxed text-gray-500">
                  <p className="text-[#1a1a1a] font-bold mb-1">Entry Notice</p>
                  Please arrive <span className="text-[#494136] font-bold">10 minutes early</span>. Show this digital ticket at the front desk upon arrival. Confirmation sent to your email.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <Button
          size="lg"
          className="flex-1 h-14 font-black bg-[#494136] hover:bg-[#3a342c] text-white rounded-2xl shadow-xl shadow-[#494136]/10 transition-all group"
          onClick={handleNewBooking}
        >
          Book Another Appointment
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      <div className="text-center">
        <Button
          variant="ghost"
          className="font-bold text-gray-400 hover:text-[#494136] hover:bg-[#494136]/5 rounded-xl px-8"
          onClick={handleHome}
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
