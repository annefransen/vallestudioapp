"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { format, parseISO, isPast } from "date-fns";
import {
  CalendarPlus,
  History,
  ArrowRight,
  Clock,
  Scissors,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  CalendarDays,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { DashboardHomeSkeleton } from "@/components/ui/Skeletons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";

/* ── Types ───────────────────────────────────────────────── */
type Reservation = {
  reservation_id: string;
  reservation_date: string | null;
  start_time: string | null;
  status: string;
  booking_items: Array<{
    service_id: string | null;
    services?: { service_name: string; category: string } | null;
  }>;
  payments: Array<{ amount: number | null; status: string }>;
};

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: AlertCircle,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    bg: "bg-stone-50",
    text: "text-stone-600",
    border: "border-stone-200",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
  },
  no_show: {
    label: "No Show",
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
  },
};

function formatDisplayTime(startTime: string | null): string {
  if (!startTime) return "—";
  try {
    const d = new Date(startTime);
    if (isNaN(d.getTime())) return startTime;

    // Explicitly format to Philippines time
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Manila",
    }).format(d);
  } catch {
    return startTime;
  }
}

function getGreeting(name: string | undefined) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return `${greeting}, ${name ?? "there"}`;
}

function getServiceName(item: Reservation["booking_items"][0]): string {
  return item.services?.service_name ?? "Salon Service";
}

function getServiceCategory(item: Reservation["booking_items"][0]): string {
  return item.services?.category ?? "Service";
}

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [profile, setProfile] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [bookingsRes, profileRes] = await Promise.all([
        // Use the API route which has proper server-side joins
        fetch(`/api/bookings?profile_id=${user.id}`),
        supabase
          .from("profiles")
          .select("*")
          .eq("profile_id", user.id)
          .single(),
      ]);

      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setBookings(Array.isArray(data) ? data : []);
      } else {
        const errData = await bookingsRes.json().catch(() => ({}));
        console.error(
          "[Dashboard] Bookings fetch error:",
          bookingsRes.status,
          errData.error || "",
        );
      }

      setProfile(profileRes.data);
      setLoading(false);
    };
    loadData();
  }, [supabase]);

  const handleCancel = async () => {
    if (!cancellingId) return;

    const { error } = await supabase
      .from("reservation")
      .update({ status: "cancelled" })
      .eq("reservation_id", cancellingId);

    if (error) {
      toast.error("Failed to cancel appointment");
      return;
    }

    // Create notification for cancellation
    await supabase.from("notifications").insert({
      profile_id: (await supabase.auth.getUser()).data.user?.id,
      title: "Appointment Cancelled",
      message: "Your appointment has been successfully cancelled.",
      type: "booking",
    });

    toast.success("Appointment cancelled");
    setBookings((prev) =>
      prev.map((b) =>
        b.reservation_id === cancellingId ? { ...b, status: "cancelled" } : b,
      ),
    );
    setIsCancelConfirmOpen(false);
    setCancellingId(null);
  };

  const openCancelConfirm = (id: string | null) => {
    setCancellingId(id);
    setIsCancelConfirmOpen(true);
  };

  const upcoming = useMemo(
    () =>
      bookings.filter(
        (b) =>
          (b.status === "pending" || b.status === "confirmed") &&
          b.reservation_date &&
          !isPast(parseISO(b.reservation_date)),
      ),
    [bookings],
  );

  const nextAppointment = upcoming[0] ?? null;

  const favoriteServices = useMemo(() => {
    const counts: Record<string, { name: string; count: number }> = {};
    bookings.forEach((b) => {
      const name = b.booking_items?.[0]
        ? getServiceName(b.booking_items[0])
        : null;
      if (name && name !== "Salon Service") {
        if (!counts[name]) counts[name] = { name, count: 0 };
        counts[name].count++;
      }
    });
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [bookings]);

  if (loading) return <DashboardHomeSkeleton />;

  return (
    <div className="space-y-8 pb-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
          {getGreeting(profile?.first_name)}
        </h1>
        <p className="text-sm text-stone-500 mt-0.5">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {/* Next Appointment */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
            Next Appointment
          </h2>
          {upcoming.length > 1 && (
            <Link
              href="/dashboard/appointments"
              className="text-xs font-semibold text-[#494136] hover:underline flex items-center gap-1"
            >
              View all ({upcoming.length})<ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {nextAppointment ? (
          <Card className="w-full border border-stone-200 bg-white shadow-sm">
            <CardContent className="roundedxs p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-sm bg-[#494136]/8 flex items-center justify-center shrink-0">
                    <Scissors className="w-5 h-5 text-[#494136]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1a1a1a] text-sm leading-tight">
                      {nextAppointment.booking_items?.[0]
                        ? getServiceName(nextAppointment.booking_items[0])
                        : "Salon Service"}
                    </p>
                    <p className="text-xs text-stone-500 mt-1 capitalize">
                      {nextAppointment.booking_items?.[0]
                        ? getServiceCategory(nextAppointment.booking_items[0])
                        : "Service"}
                    </p>
                  </div>
                </div>
                {(() => {
                  const cfg =
                    STATUS_CONFIG[
                      nextAppointment.status as keyof typeof STATUS_CONFIG
                    ] ?? STATUS_CONFIG.pending;
                  const Icon = cfg.icon;
                  return (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border} shrink-0`}
                    >
                      <Icon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  );
                })()}
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-5 text-sm text-stone-600">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-stone-400" />
                  <span className="font-medium">
                    {nextAppointment.reservation_date
                      ? format(
                          parseISO(nextAppointment.reservation_date),
                          "MMM d, yyyy",
                        )
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-stone-400" />
                  <span className="font-medium">
                    {formatDisplayTime(nextAppointment.start_time)}
                  </span>
                </div>
                {nextAppointment.payments?.[0]?.amount && (
                  <div className="ml-auto">
                    <span className="text-xs text-stone-400 font-medium">
                      ₱
                      {Number(
                        nextAppointment.payments[0].amount,
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {(nextAppointment.status === "pending" ||
                nextAppointment.status === "confirmed") && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors cursor-pointer"
                    onClick={() =>
                      openCancelConfirm(nextAppointment.reservation_id)
                    }
                  >
                    Cancel Appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full border border-dashed border-stone-200 bg-stone-50/50">
            <CardContent className="p-8 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-sm bg-stone-100 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-stone-400" />
              </div>
              <div>
                <p className="font-semibold text-sm text-stone-700">
                  No upcoming appointments
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Book a service to get started
                </p>
              </div>
              <Link href="/dashboard/book">
                <Button
                  size="sm"
                  className="mt-1 bg-[#494136] hover:bg-[#3a342c] text-white border-0"
                >
                  <CalendarPlus className="w-3.5 h-3.5 mr-1.5" />
                  Book Appointment
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">
          Quick Actions
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/book" className="flex-1">
            <button className="w-full flex items-center justify-between px-5 py-4 rounded-sm border border-stone-200 bg-white hover:border-[#494136]/30 hover:bg-stone-50 transition-all duration-150 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-sm bg-[#494136]/8 flex items-center justify-center">
                  <CalendarPlus className="w-4 h-4 text-[#494136]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#1a1a1a]">
                    Book Appointment
                  </p>
                  <p className="text-xs text-stone-500">Schedule a new visit</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#494136] transition-colors" />
            </button>
          </Link>
          <Link href="/dashboard/history" className="flex-1">
            <button className="w-full flex items-center justify-between px-5 py-4 rounded-sm border border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50 transition-all duration-150 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-sm bg-stone-100 flex items-center justify-center">
                  <History className="w-4 h-4 text-stone-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#1a1a1a]">
                    View History
                  </p>
                  <p className="text-xs text-stone-500">
                    Past appointments & receipts
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors" />
            </button>
          </Link>
        </div>
      </section>

      {/* Favorite Services */}
      {favoriteServices.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">
            Your Favorite Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favoriteServices.map(({ name, count }) => (
              <Card
                key={name}
                className="border border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm transition-all duration-150"
              >
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-sm bg-amber-50 flex items-center justify-center shrink-0">
                      <Scissors className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1a1a1a] leading-tight">
                        {name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-stone-500">
                          Booked {count} {count === 1 ? "time" : "times"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href="/dashboard/book">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-stone-200 hover:bg-[#494136] hover:text-white hover:border-[#494136] transition-colors cursor-pointer"
                    >
                      Book Again
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
      {/* Cancellation Confirmation Dialog */}
      <Dialog open={isCancelConfirmOpen} onOpenChange={setIsCancelConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Appointment?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <DialogClose
              render={<Button variant="outline" className="cursor-pointer" />}
            >
              No, Keep Appointment
            </DialogClose>
            <Button
              variant="default"
              className="bg-red-500 hover:bg-red-600 text-white border-0 cursor-pointer"
              onClick={handleCancel}
            >
              Yes, Cancel Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
