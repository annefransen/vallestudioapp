"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import {
  History as HistoryIcon,
  CalendarPlus,
  Scissors,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { HistorySkeleton } from "@/components/ui/Skeletons";

type ReservationService = { service_name: string; category: string };
type ReservationBookingItem = { services: ReservationService };
type ReservationPayment = { amount: number | null; status: string };
type Reservation = {
  reservation_id: string;
  reservation_date: string | null;
  status: string;
  booking_items: ReservationBookingItem[];
  payments: ReservationPayment[];
};

export default function HistoryPage() {
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("reservation")
        .select("*, booking_items(*, services(*)), payments(*)")
        .eq("profile_id", user.id)
        .in("status", ["completed", "cancelled", "no_show"])
        .order("reservation_date", { ascending: false });
      if (error) console.error(error);
      setBookings(data ?? []);
      setLoading(false);
    };
    load();
  }, [supabase]);

  if (loading) return <HistorySkeleton />;

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
          History
        </h1>
        <p className="text-sm text-stone-500 mt-0.5">
          Your past appointments and receipts
        </p>
      </div>

      {/* Table Card */}
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center">
            <HistoryIcon className="w-7 h-7 text-stone-400" />
          </div>
          <div>
            <p className="font-semibold text-stone-700">No history yet</p>
            <p className="text-sm text-stone-500 mt-0.5">
              Completed appointments will appear here
            </p>
          </div>
          <Link href="/dashboard/book">
            <Button
              size="sm"
              className="bg-[#494136] hover:bg-[#3a342c] text-white border-0"
            >
              <CalendarPlus className="w-3.5 h-3.5 mr-1.5" />
              Book Appointment
            </Button>
          </Link>
        </div>
      ) : (
        <Card className="border border-stone-200 overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-[1fr_140px_100px_100px_120px] gap-4 px-5 py-3 bg-stone-50 border-b border-stone-200">
            {["Service", "Date", "Category", "Amount", ""].map((h) => (
              <span
                key={h}
                className="text-[10px] font-bold uppercase tracking-widest text-stone-400"
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-stone-100">
            {bookings.map((booking) => {
              const service = booking.booking_items?.[0]?.services;
              const payment = booking.payments?.[0];
              const isCompleted = booking.status === "completed";

              return (
                <div
                  key={booking.reservation_id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_140px_100px_100px_120px] gap-3 md:gap-4 items-center px-5 py-4 hover:bg-stone-50/60 transition-colors duration-100"
                >
                  {/* Service */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                      <Scissors className="w-4 h-4 text-stone-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1a1a1a] leading-tight">
                        {service?.service_name ?? "Salon Service"}
                      </p>
                      <p className="text-[11px] text-stone-400 md:hidden mt-0.5">
                        {booking.reservation_date
                          ? format(
                              parseISO(booking.reservation_date),
                              "MMM d, yyyy"
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <span className="hidden md:block text-sm text-stone-600">
                    {booking.reservation_date
                      ? format(parseISO(booking.reservation_date), "MMM d, yyyy")
                      : "—"}
                  </span>

                  {/* Category */}
                  <span className="hidden md:block text-xs text-stone-500 capitalize">
                    {service?.category ?? "—"}
                  </span>

                  {/* Amount */}
                  <span className="hidden md:block text-sm font-semibold text-[#494136]">
                    {payment?.amount
                      ? `₱${Number(payment.amount).toLocaleString()}`
                      : "—"}
                  </span>

                  {/* Status + Action */}
                  <div className="flex items-center gap-2 justify-between md:justify-start">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border",
                        isCompleted
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {isCompleted ? "Completed" : "Cancelled"}
                    </span>

                    {isCompleted && (
                      <Link href="/dashboard/book">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[11px] h-7 px-3 border-stone-200 hover:bg-[#494136] hover:text-white hover:border-[#494136] transition-colors cursor-pointer"
                        >
                          Book Again
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
