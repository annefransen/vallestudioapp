"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Smartphone,
  Loader2,
  CheckCircle,
  Receipt,
  Tag,
  Calendar,
  Clock,
  Scissors,
  ArrowRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { useCustomerBooking } from "@/contexts/CustomerBookingContext";
import { toast } from "sonner";
import Link from "next/link";
import { BookingProgressBar } from "@/components/ui/BookingProgressBar";

/* ─── Confirmation Modal (no page navigation needed) ──────── */
function ConfirmationModal({
  open,
  ticketId,
  onBookAnother,
  onHome,
}: {
  open: boolean;
  ticketId: string;
  onBookAnother: () => void;
  onHome: () => void;
}) {
  const { selectedServices, selectedDate, selectedTime, getTotalPrice } =
    useCustomerBooking();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[95vh] animate-in zoom-in-95 fade-in duration-200">
        {/* Success Header */}
        <div className="text-center pt-10 pb-6 px-8">
          <div className="relative inline-flex items-center justify-center mb-5">
            <div className="absolute inset-0 bg-[#494136]/5 rounded-full scale-150 animate-pulse" />
            <div className="relative w-20 h-20 bg-[#494136] rounded-full flex items-center justify-center shadow-xl shadow-[#494136]/20 ring-8 ring-white">
              <CheckCircle className="w-10 h-10 text-white stroke-[2.5]" />
            </div>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[#1a1a1a] mb-1">
            Booking Confirmed!
          </h2>
          <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">
            Your appointment at Valle Studio has been successfully scheduled. We
            can&apos;t wait to see you!
          </p>
        </div>

        {/* Ticket */}
        <div className="mx-6 mb-6 rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm">
          {/* Reference */}
          <div className="bg-[#494136] px-6 py-4 text-center">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1">
              Booking Reference
            </p>
            <p className="text-xl font-black text-white tracking-widest leading-none">
              {ticketId}
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-5 border-b border-gray-100 pb-5">
              <div>
                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
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
              <div>
                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
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

            {/* Services */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Scissors className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Services
                </span>
              </div>
              <div className="space-y-2">
                {selectedServices.map((s) => (
                  <div key={s.id} className="flex justify-between items-center">
                    <span className="text-sm font-bold text-[#1a1a1a]">
                      {s.name}
                    </span>
                    <span className="text-sm font-black text-[#494136]">
                      ₱{s.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t-2 border-dashed border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400">
                  Total Paid
                </span>
                <span className="text-2xl font-black text-[#494136]">
                  ₱{getTotalPrice().toLocaleString()}
                </span>
              </div>
            </div>

            {/* Notice */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex gap-3">
                <div className="size-5 bg-[#494136]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <div className="size-1.5 bg-[#494136] rounded-full" />
                </div>
                <p className="text-[11px] font-medium leading-relaxed text-gray-500">
                  <span className="text-[#1a1a1a] font-bold">Entry Notice</span>{" "}
                  Please arrive{" "}
                  <span className="text-[#494136] font-bold">
                    10 minutes early
                  </span>
                  . Show this ticket at the front desk upon arrival.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 px-6 pb-8">
          <Button
            size="lg"
            className="w-full h-12 font-black bg-[#494136] hover:bg-[#3a342c] text-white rounded-2xl cursor-pointer group"
            onClick={onBookAnother}
          >
            Book Another Appointment
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="ghost"
            className="w-full font-bold text-gray-400 hover:text-[#494136] hover:bg-[#494136]/5 rounded-xl cursor-pointer"
            onClick={onHome}
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Payment Page ───────────────────────────────────── */
export default function CustomerBookStep5Payment() {
  const router = useRouter();
  const {
    customerInfo,
    selectedServices,
    selectedDate,
    selectedTime,
    selectedStylist,
    getTotalPrice,
    profileId,
    resetBooking,
  } = useCustomerBooking();

  const [isProcessing, setIsProcessing] = useState(false);
  const [gcashNumber, setGcashNumber] = useState("");
  const [gcashName, setGcashName] = useState(
    customerInfo.first_name && customerInfo.last_name
      ? `${customerInfo.first_name} ${customerInfo.last_name}`
      : "",
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [ticketId, setTicketId] = useState("");

  useEffect(() => {
    if (
      !customerInfo.first_name ||
      selectedServices.length === 0 ||
      !selectedDate ||
      !selectedTime
    ) {
      router.replace("/dashboard/book");
    }
  }, [customerInfo, selectedServices, selectedDate, selectedTime, router]);

  if (!customerInfo.first_name) return null;

  const handleConfirmPayment = async () => {
    if (!gcashNumber || !gcashName) {
      toast.error("Please fill in all GCash payment details");
      return;
    }
    if (gcashNumber.length < 10) {
      toast.error("Please enter a valid GCash number");
      return;
    }

    setIsProcessing(true);

    try {
      const booking_date = selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : "";
      const timeParts = selectedTime!.match(/(\d+):(\d+)\s*(AM|PM)/i);
      let booking_time = "10:00";
      if (timeParts) {
        let h = parseInt(timeParts[1]);
        const m = timeParts[2];
        const period = timeParts[3].toUpperCase();
        if (period === "PM" && h !== 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        booking_time = `${String(h).padStart(2, "0")}:${m}`;
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_id: profileId,
          guest_name: `${customerInfo.first_name} ${customerInfo.last_name}`,
          guest_email: customerInfo.gmail,
          guest_phone: customerInfo.contact_number,
          service_id: selectedServices[0]?.id,
          stylist_id:
            selectedStylist?.id === "any" ? null : selectedStylist?.id,
          booking_date,
          booking_time,
          notes: String(customerInfo.notes ?? ""),
          payment_method: "gcash",
          amount: getTotalPrice(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Booking failed");
        setIsProcessing(false);
        return;
      }

      // Generate a ticket ID
      const ref =
        json.bookingId?.slice(0, 8).toUpperCase() ??
        `VS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setTicketId(`VS-${ref}`);
      setShowConfirmation(true);
      toast.success("Booking confirmed!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleBookAnother = () => {
    resetBooking();
    setShowConfirmation(false);
    router.push("/dashboard/book");
  };

  const handleHome = () => {
    resetBooking();
    setShowConfirmation(false);
    router.push("/dashboard");
  };

  return (
    <>
      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmation}
        ticketId={ticketId}
        onBookAnother={handleBookAnother}
        onHome={handleHome}
      />

      {/* Payment Page */}
      <div className="max-w-6xl mx-auto pb-36 mt-8 px-6 sm:px-0">
        <BookingProgressBar />
        <div className="max-w-5xl mx-auto font-sans pb-10">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 tracking-tight text-[#1a1a1a]">
              Secure Payment
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Complete your payment via GCash to confirm your appointment at
              Valle Studio
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Order Summary */}
            <div className="h-full flex flex-col">
              <Card className="border-gray-200/80 bg-white shadow-sm rounded-sm overflow-hidden h-full flex flex-col">
                <CardHeader className="py-4">
                  <CardTitle className="text-base font-bold text-[#1a1a1a] flex items-center gap-2">
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 space-y-6 flex flex-col flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Services
                      </span>
                    </div>
                    {selectedServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#1a1a1a]">
                            {service.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-[#494136]">
                          ₱{service.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-dashed border-gray-100 space-y-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Details
                    </span>
                    <div className="flex justify-between items-center text-[13px] pt-4">
                      <span className="text-gray-400 font-medium">
                        Appointment
                      </span>
                      <span className="text-[#1a1a1a] font-bold">
                        {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-gray-400 font-medium">Date</span>
                      <span className="text-[#1a1a1a] font-bold">
                        {selectedDate?.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-gray-400 font-medium">Client</span>
                      <span className="text-[#1a1a1a] font-bold line-clamp-1">
                        {customerInfo.first_name} {customerInfo.last_name}
                      </span>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-gray-100 mt-auto">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Total Pay
                        </span>
                      </div>
                      <span className="text-2xl font-black text-[#494136]">
                        ₱{getTotalPrice().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* GCash Payment Form */}
            <div className="space-y-6">
              <Card className="border-gray-200/80 bg-white shadow-sm rounded-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div>
                    <CardTitle className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                      <Smartphone className="text-blue-600 w-5 h-5" />
                      GCash Payment
                    </CardTitle>
                    <CardDescription className="text-[11px] font-medium leading-none mt-1">
                      Pay securely using GCash account
                    </CardDescription>
                  </div>
                  <div className="bg-[#007dfe] text-white text-[10px] font-bold px-2 py-1 rounded">
                    GCash
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="gcashNumber"
                      className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      GCash Mobile Number
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-sm font-bold text-gray-400">
                        +63
                      </span>
                      <Input
                        id="gcashNumber"
                        placeholder="9XX XXX XXXX"
                        value={gcashNumber}
                        onChange={(e) => setGcashNumber(e.target.value)}
                        maxLength={11}
                        className="h-12 pl-12 rounded-sm border-gray-100 focus:border-[#494136] focus:ring-[#494136]/20 transition-all font-semibold bg-slate-100"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Enter your registered 11-digit GCash mobile number
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="gcashName"
                      className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      Account Name
                    </Label>
                    <Input
                      id="gcashName"
                      placeholder="MARIA SANTOS"
                      value={gcashName}
                      onChange={(e) => setGcashName(e.target.value)}
                      className="h-12 rounded-sm border-gray-100 focus:border-[#494136] focus:ring-[#494136]/20 transition-all uppercase font-semibold bg-slate-100"
                    />
                    <p className="text-[10px] text-gray-400 font-medium">
                      Full name as registered on your GCash account
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-sm border border-blue-200 mt-2">
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                      <div className="text-[11px] leading-relaxed font-medium">
                        <p className="text-blue-800 font-bold mb-0.5">
                          Instant Confirmation
                        </p>
                        <p className="text-blue-700">
                          You will receive an SMS and In-App notification to
                          authorize this transaction once you click pay.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                size="lg"
                className="w-full h-14 text-base font-bold bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-sm shadow-xl shadow-blue-500/20 transition-all"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Pay ₱{getTotalPrice().toLocaleString()} now</>
                )}
              </Button>

              <Button
                variant="ghost"
                className="w-full font-semibold text-[#494136] bg-slate-100 hover:bg-slate-200 rounded-sm cursor-pointer"
                onClick={() => router.push("/dashboard/book/info")}
                disabled={isProcessing}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to information
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
