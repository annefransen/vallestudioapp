"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, CalendarDays, Home, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";

import { Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const shortId = bookingId?.slice(0, 8).toUpperCase() ?? "—";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 pb-6">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-2">
        Booking Confirmed!
      </h1>
      <p className="text-stone-500 text-sm max-w-sm mb-6">
        Your appointment has been booked successfully. You'll receive a
        confirmation to your email shortly.
      </p>

      {/* Booking ID */}
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 mb-8">
        <span className="text-xs text-stone-400 font-medium">Booking ID</span>
        <span className="text-sm font-bold text-[#494136] tracking-wider">
          #{shortId}
        </span>
      </div>

      {/* What's next */}
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-xl p-5 mb-8 text-left">
        <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">
          What's Next
        </h2>
        <ul className="space-y-2">
          {[
            "We'll send a confirmation email with your booking details",
            "Arrive 5 minutes before your appointment",
            "Bring this booking ID or check your email",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-stone-600">
              <span className="w-5 h-5 rounded-full bg-[#494136]/8 flex items-center justify-center text-[10px] font-bold text-[#494136] shrink-0 mt-0.5">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard/appointments">
          <Button
            variant="outline"
            className="border-stone-200 hover:bg-stone-50 cursor-pointer"
          >
            <CalendarDays className="w-4 h-4 mr-1.5" />
            View My Appointments
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button className="bg-[#494136] hover:bg-[#3a342c] text-white border-0 cursor-pointer">
            <Home className="w-4 h-4 mr-1.5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CustomerBookConfirmation() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  );
}
