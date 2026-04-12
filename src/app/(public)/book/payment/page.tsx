"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Smartphone,
  Loader2,
  CheckCircle,
  Receipt,
  Tag,
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
import { useBooking } from "@/contexts/BookingContext";
import { toast } from "sonner";

export default function PaymentPage() {
  const router = useRouter();
  const {
    guestInfo,
    selectedServices,
    selectedDate,
    selectedTime,
    getTotalPrice,
  } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);

  // GCash payment fields
  const [gcashNumber, setGcashNumber] = useState("");
  const [gcashName, setGcashName] = useState(
    guestInfo?.first_name && guestInfo?.last_name
      ? `${guestInfo.first_name} ${guestInfo.last_name}`
      : "",
  );

  useEffect(() => {
    if (
      !guestInfo ||
      selectedServices.length === 0 ||
      !selectedDate ||
      !selectedTime
    ) {
      router.replace("/book/services");
    }
  }, [guestInfo, selectedServices, selectedDate, selectedTime, router]);

  const handleConfirmPayment = () => {
    if (!gcashNumber || !gcashName) {
      toast.error("Please fill in all GCash payment details");
      return;
    }

    if (gcashNumber.length < 10) {
      toast.error("Please enter a valid GCash number");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing flow
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Payment successful! Your booking is confirmed.");
      router.push("/book/confirmation");
    }, 2000);
  };

  if (!guestInfo) return null;

  return (
    <div className="max-w-5xl mx-auto font-sans pb-10">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 tracking-tight text-[#1a1a1a]">
          Secure Payment
        </h2>
        <p className="text-sm text-gray-500 font-medium">
          Complete your payment via GCash to confirm your appointment at Valle
          Studio
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Booking Summary - Sticky */}
        <div className="lg:sticky lg:top-8">
          <Card className="border-gray-200/80 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="py-4 border-b border-gray-50">
              <CardTitle className="text-base font-bold text-[#1a1a1a] flex items-center gap-2">
                <Receipt className="w-4 h-4 text-gray-400" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-3.5 h-3.5 text-gray-300" />
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
                      <span className="text-[10px] text-gray-400 font-medium">
                        Beauty Treatment
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[#494136]">
                      ₱{service.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-dashed border-gray-100 space-y-3">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-gray-400 font-medium">Appointment</span>
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
                    {guestInfo.first_name} {guestInfo.last_name}
                  </span>
                </div>
              </div>

              <div className="pt-5 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Total Pay
                    </span>
                    <span className="text-[10px] text-gray-300 font-medium">
                      Vat Included
                    </span>
                  </div>
                  <span className="text-2xl font-black text-[#494136]">
                    ₱{getTotalPrice()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* GCash Payment Form */}
        <div className="space-y-6">
          <Card className="border-gray-200/80 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#494136]" />
                  GCash Payment
                </CardTitle>
                <CardDescription className="text-[11px] font-medium leading-none mt-1">
                  Secure checkout powered by GCash
                </CardDescription>
              </div>
              <div className="bg-[#007dfe] text-white text-[10px] font-bold px-2 py-1 rounded">
                GCash
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
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
                    className="h-12 pl-12 rounded-xl border-gray-100 focus:border-[#494136] focus:ring-[#494136]/20 transition-all font-semibold"
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
                  className="h-12 rounded-xl border-gray-100 focus:border-[#494136] focus:ring-[#494136]/20 transition-all uppercase font-semibold"
                />
                <p className="text-[10px] text-gray-400 font-medium">
                  Full name as registered on your GCash account
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mt-2">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 " />
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
            className="w-full h-14 text-base font-bold bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-2xl shadow-xl shadow-[#494136]/10 transition-all"
            onClick={handleConfirmPayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Smartphone className="w-5 h-5 mr-3" />
                Pay ₱{getTotalPrice()} now
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            className="w-full font-semibold text-[#494136] bg-yellow-100 hover:bg-yellow-200 rounded-xl cursor-pointer"
            onClick={() => router.push("/book/guest-info")}
            disabled={isProcessing}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to information
          </Button>
        </div>
      </div>
    </div>
  );
}
