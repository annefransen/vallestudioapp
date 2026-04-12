"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { format, parseISO, isPast } from "date-fns";
import {
  CalendarDays,
  Clock,
  Scissors,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  CalendarPlus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AppointmentsSkeleton } from "@/components/ui/Skeletons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";

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

function getServiceName(booking: Reservation): string {
  return booking.booking_items?.[0]?.services?.service_name ?? "Salon Service";
}
function getServiceCategory(booking: Reservation): string {
  return booking.booking_items?.[0]?.services?.category ?? "Service";
}

type Tab = "upcoming" | "completed" | "cancelled";

function AppointmentCard({
  booking,
  onCancel,
}: {
  booking: Reservation;
  onCancel: (id: string) => void;
}) {
  const cfg =
    STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const payment = booking.payments?.[0];
  const isUpcoming =
    booking.reservation_date && !isPast(parseISO(booking.reservation_date));
  const canCancel =
    (booking.status === "pending" || booking.status === "confirmed") &&
    isUpcoming;

  return (
    <Card className="border border-stone-200 bg-white hover:shadow-sm transition-shadow duration-150">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div>
              <p className="font-bold text-sm text-[#1a1a1a] leading-tight">
                {getServiceName(booking)}
              </p>
              <p className="text-xs text-stone-500 mt-0.5 capitalize">
                {getServiceCategory(booking)}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}
          >
            <Icon className="w-3 h-3" />
            {cfg.label}
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-4 text-sm text-stone-600">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-medium text-xs">
              {booking.reservation_date
                ? format(parseISO(booking.reservation_date), "MMM d, yyyy")
                : "—"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-medium text-xs">
              {formatDisplayTime(booking.start_time)}
            </span>
          </div>
          {payment && (
            <div className="ml-auto text-right">
              <p className="text-xs font-bold text-[#494136]">
                ₱{Number(payment.amount ?? 0).toLocaleString()}
              </p>
              <p
                className={cn(
                  "text-[10px] font-semibold uppercase",
                  payment.status === "paid"
                    ? "text-green-600"
                    : "text-amber-600",
                )}
              >
                {payment.status === "paid" ? "Paid" : "Pending"}
              </p>
            </div>
          )}
        </div>

        {canCancel && (
          <div className="mt-3 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
              onClick={() => onCancel(booking.reservation_id)}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AppointmentsPage() {
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const res = await fetch(`/api/bookings?profile_id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error(
          "[Appointments] Fetch error:",
          res.status,
          res.statusText,
          errData.error || "",
        );
      }
      setLoading(false);
    };
    load();
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("notifications").insert({
        profile_id: user.id,
        title: "Appointment Cancelled",
        message: "Your appointment has been successfully cancelled.",
        type: "booking",
      });
    }

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

  const completed = useMemo(
    () => bookings.filter((b) => b.status === "completed"),
    [bookings],
  );
  const cancelled = useMemo(
    () =>
      bookings.filter(
        (b) => b.status === "cancelled" || b.status === "no_show",
      ),
    [bookings],
  );

  const tabData: Record<Tab, Reservation[]> = {
    upcoming,
    completed,
    cancelled,
  };
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "upcoming", label: "Upcoming", count: upcoming.length },
    { id: "completed", label: "Completed", count: completed.length },
    { id: "cancelled", label: "Cancelled", count: cancelled.length },
  ];
  const currentList = tabData[activeTab];

  if (loading) return <AppointmentsSkeleton />;

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
          My Appointments
        </h1>
        <p className="text-sm text-stone-500 mt-0.5">
          Track your upcoming and past appointments
        </p>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-6 border-b border-stone-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-3 text-sm font-semibold transition-colors duration-150 cursor-pointer relative",
              activeTab === tab.id
                ? "text-[#1a1a1a]"
                : "text-stone-500 hover:text-[#1a1a1a]",
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-1 left-0 right-0 h-[2px] bg-[#1a1a1a]" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
        </div>
      ) : currentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center">
            <CalendarDays className="w-7 h-7 text-stone-400" />
          </div>
          <div>
            <p className="font-semibold text-stone-700">
              No {activeTab} appointments
            </p>
            <p className="text-sm text-stone-500 mt-0.5">
              {activeTab === "upcoming"
                ? "Book a service to see it here"
                : "Your appointments will appear here"}
            </p>
          </div>
          {activeTab === "upcoming" && (
            <Link href="/dashboard/book">
              <Button
                size="sm"
                className="bg-[#494136] hover:bg-[#3a342c] text-white border-0"
              >
                <CalendarPlus className="w-3.5 h-3.5 mr-1.5" />
                Book Appointment
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((booking) => (
            <AppointmentCard
              key={booking.reservation_id}
              booking={booking}
              onCancel={openCancelConfirm}
            />
          ))}
        </div>
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
