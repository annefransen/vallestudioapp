"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  User,
  Mail,
  Phone,
  CreditCard,
  Notebook,
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
import { Textarea } from "@/components/ui/Textarea";
import { useBooking } from "@/contexts/BookingContext";
import { toast } from "sonner";

export default function GuestInfoPage() {
  const router = useRouter();
  const {
    guestInfo,
    setGuestInfo,
    selectedTime,
    selectedServices,
    selectedDate,
    getTotalPrice,
  } = useBooking();

  useEffect(() => {
    if (selectedServices.length === 0 || !selectedTime) {
      router.replace("/book/services");
    }
  }, [selectedServices, selectedTime, router]);

  const details = guestInfo || {
    first_name: "",
    last_name: "",
    gmail: "",
    contact_number: "",
    notes: "",
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setGuestInfo({ ...details, [e.target.name]: e.target.value });
  };

  const handleBookAnother = () => {
    toast.success("Great! Add another appointment");
    router.push("/book/services");
  };

  const handleProceedToPayment = () => {
    if (
      !details.first_name ||
      !details.last_name ||
      !details.gmail ||
      !details.contact_number
    ) {
      toast.error("Please fill in all contact details");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(details.gmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    router.push("/book/payment");
  };

  if (selectedServices.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-1.5 tracking-tight text-[#1a1a1a]">
          Your Information
        </h2>
        <p className="text-sm text-gray-500 font-medium">
          Please provide your contact information to finalize your booking
        </p>
      </div>

      <div className="gap-8 items-start">
        {/* Main form area */}
        <div className="space-y-6">
          <Card className="border-gray-200/80 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-lg font-bold text-[#1a1a1a]">
                Contact Details
              </CardTitle>
              <CardDescription className="text-xs">
                We'll use this to send your booking confirmation
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="first_name"
                    className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="first_name"
                      name="first_name"
                      placeholder="e.g. Maria"
                      className="pl-10 h-10 rounded-xl border-gray-100 focus:border-[#494136] focus:ring-[#494136]/20 transition-all"
                      value={details.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="last_name"
                    className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    placeholder="e.g. Santos"
                    className="h-10 rounded-xl border-gray-100 focus:border-[#494136] focus:ring-[#494136]/20 transition-all"
                    value={details.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="gmail"
                    className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="gmail"
                      name="gmail"
                      placeholder="e.g. [EMAIL_ADDRESS]"
                      className="pl-10 h-10 rounded-xl border-gray-100 focus:border-[#494136] focus:ring-[#494136]/20 transition-all"
                      value={details.gmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="contact_number"
                    className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Contact Number
                  </Label>
                  <Input
                    id="contact_number"
                    name="contact_number"
                    placeholder="e.g. 09123456789"
                    className="h-10 rounded-xl border-gray-100 focus:border-[#494136] focus:ring-[#494136]/20 transition-all"
                    value={details.contact_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="notes"
                  className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Notes
                </Label>
                <div className="relative">
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="e.g. I want a trim"
                    className="pl-3 h-[150px] resize-none rounded-xl border-gray-100 focus:border-[#494136] focus:ring-[#494136]/20 transition-all"
                    value={details.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 mt-10 border-t border-gray-200/70">
        <Button
          variant="outline"
          className="w-full sm:w-auto font-semibold rounded-xl transition-all hover:bg-gray-50 cursor-pointer"
          onClick={() => router.push("/book/datetime")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Date & Time
        </Button>
        <Button
          size="lg"
          onClick={handleProceedToPayment}
          className="w-full sm:w-auto font-bold bg-[#494136] hover:bg-[#3a342c] text-white rounded-xl shadow-lg shadow-[#494136]/10 transition-all cursor-pointer"
        >
          Finalize Booking
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
