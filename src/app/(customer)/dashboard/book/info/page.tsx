"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Phone,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { toast } from "sonner";
import { BookInfoSkeleton } from "@/components/ui/Skeletons";
import { BookingProgressBar } from "@/components/ui/BookingProgressBar";
import { useCustomerBooking } from "@/contexts/CustomerBookingContext";

export default function CustomerBookStep4Info() {
  const router = useRouter();
  const {
    selectedServices,
    selectedTime,
    customerInfo,
    setCustomerInfo,
    profileLoading,
  } = useCustomerBooking();

  if (profileLoading) return <BookInfoSkeleton />;

  useEffect(() => {
    if (selectedServices.length === 0 || !selectedTime) {
      router.replace("/dashboard/book");
    }
  }, [selectedServices, selectedTime, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    const { first_name, last_name, gmail, phone } = customerInfo;
    if (!first_name || !last_name || !gmail || !phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(gmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    router.push("/dashboard/book/payment");
  };

  if (selectedServices.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto pb-36 mt-8 px-6 sm:px-0">
      <BookingProgressBar />

      <div className="max-w-4xl mx-auto font-sans">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-1.5 tracking-tight text-[#1a1a1a]">
            Your Information
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Pre-filled from your account — update if needed
          </p>
        </div>

        {/* Form Card */}
        <Card className="border border-stone-200">
          <CardHeader className="px-5 py-4 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-[#494136]" />
              <h3 className="text-sm font-bold text-[#1a1a1a]">
                Contact Details
              </h3>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="first_name"
                  className="text-xs font-bold tracking-wider text-stone-400"
                >
                  First Name <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <Input
                    id="first_name"
                    name="first_name"
                    placeholder="Maria"
                    value={customerInfo.first_name}
                    onChange={handleChange}
                    className="pl-10 h-10 rounded-lg border-stone-200 focus:border-[#494136] focus:ring-[#494136]/20"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="last_name"
                  className="text-xs font-bold tracking-wider text-stone-400"
                >
                  Last Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Santos"
                  value={customerInfo.last_name}
                  onChange={handleChange}
                  className="h-10 rounded-lg border-stone-200 focus:border-[#494136] focus:ring-[#494136]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="gmail"
                  className="text-xs font-bold tracking-wider text-stone-400"
                >
                  Email Address <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <Input
                    id="gmail"
                    name="gmail"
                    type="email"
                    placeholder="maria@email.com"
                    value={customerInfo.gmail}
                    onChange={handleChange}
                    className="pl-10 h-10 rounded-lg border-stone-200 focus:border-[#494136] focus:ring-[#494136]/20"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="text-xs font-bold tracking-wider text-stone-400"
                >
                  Phone Number <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="09123456789"
                    value={customerInfo.phone}
                    onChange={handleChange}
                    className="pl-10 h-10 rounded-lg border-stone-200 focus:border-[#494136] focus:ring-[#494136]/20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="notes"
                className="text-xs font-bold tracking-wider text-stone-400"
              >
                Notes for Stylist
                <span className="text-stone-400 font-normal normal-case tracking-normal ml-1">
                  (Optional)
                </span>
              </Label>
              <div className="relative">
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="e.g., Don't cut too short, Sensitive scalp..."
                  value={String(customerInfo.notes ?? "")}
                  onChange={handleChange}
                  className="h-28 resize-none rounded-lg border-stone-200 focus:border-[#494136] focus:ring-[#494136]/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 mt-10  border-gray-200/70">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/book/datetime")}
            className="w-full sm:w-auto font-semibold text-[#494136] border-2 hover:bg-stone-50 rounded-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Date & Time
          </Button>
          <Button
            size="lg"
            onClick={handleNext}
            className="w-full sm:w-auto font-bold bg-[#494136] hover:bg-[#3a342c] text-white rounded-sm shadow-lg shadow-[#494136]/10 transition-all cursor-pointer"
          >
            Finalize Booking
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
