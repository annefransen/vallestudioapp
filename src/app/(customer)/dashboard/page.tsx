"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { format, parseISO, isPast, isToday, isFuture } from "date-fns";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Scissors,
  ArrowRight,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  CalendarClock,
  History,
  Star,
  User,
  Heart,
  ShoppingBasket,
  Trash2,
  Tag,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: AlertCircle, className: "status-pending" },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "status-confirmed",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "status-completed",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "status-cancelled",
  },
  no_show: { label: "No Show", icon: XCircle, className: "status-no_show" },
};

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${period}`;
}

type ReservationService = { service_name: string; category: string };
type ReservationBookingItem = { services: ReservationService };
type ReservationPayment = {
  payment_method: string | null;
  status: string;
  amount: number | null;
};
type UnifiedReservation = {
  reservation_id: string;
  reservation_date: string | null;
  start_time: string | null;
  status: string;
  payment_status: string | null;
  profile_id: string;
  booking_items: ReservationBookingItem[];
  payments: ReservationPayment[];
};

function BookingCard({
  booking,
  onCancel,
}: {
  booking: UnifiedReservation;
  onCancel: (id: string) => void;
}) {
  const status = booking.status;
  const config =
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ||
    STATUS_CONFIG.pending;
  const StatusIcon = config.icon;
  const bookingDate = parseISO(
    booking.reservation_date || new Date().toISOString(),
  );
  const isUpcoming = !isPast(bookingDate) || isToday(bookingDate);
  const canCancel =
    (status === "pending" || status === "confirmed") && isUpcoming;
  const mainService = booking.booking_items?.[0]?.services;
  const paymentRecord = booking.payments?.[0];

  let displayTime = "00:00";
  if (booking.start_time) {
    const d = new Date(booking.start_time);
    displayTime = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  return (
    <Card className="border-border/30 hover:shadow-md hover:border-border/60 transition-all duration-200 cursor-pointer">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shrink-0 shadow-sm">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">
                {mainService?.service_name || "Salon Service"}
              </p>
              <Badge
                variant="secondary"
                className={`text-xs mt-0.5 category-${mainService?.category || "hair"}`}
              >
                {mainService?.category || "General"}
              </Badge>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={`text-xs ${config.className} shrink-0`}
          >
            <StatusIcon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            {format(bookingDate, "MMM d, yyyy")}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {formatTime(displayTime)}
          </div>
        </div>

        {paymentRecord && (
          <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
            <span className="text-muted-foreground uppercase tracking-wider font-medium text-[0.625rem]">
              {paymentRecord.payment_method?.replace(/_/g, " ")} Payment
            </span>
            <span
              className={
                paymentRecord.status === "paid" ||
                booking.payment_status === "paid"
                  ? "text-green-600 font-medium"
                  : "text-amber-600 font-medium"
              }
            >
              {paymentRecord.status === "paid" ||
              booking.payment_status === "paid"
                ? "Paid"
                : "Pending"}{" "}
              — ₱{(Number(paymentRecord.amount) || 0).toLocaleString()}
            </span>
          </div>
        )}

        {canCancel && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 text-destructive border-destructive/20 hover:bg-destructive/5 hover:border-destructive/40 hover:text-destructive transition-colors duration-200"
            onClick={() => onCancel(booking.reservation_id)}
          >
            Cancel Appointment
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState<UnifiedReservation[]>([]);
  const [profile, setProfile] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [basketItems, setBasketItems] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Load basket from localStorage
    const savedBasket = localStorage.getItem("salon_basket");
    if (savedBasket) {
      try {
        setBasketItems(JSON.parse(savedBasket));
      } catch (e) {
        console.error("Failed to parse basket");
      }
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [bookingsRes, profileRes] = await Promise.all([
        supabase
          .from("reservation")
          .select("*, booking_items(*, services(*)), payments(*)")
          .eq("profile_id", user.id)
          .order("reservation_date", { ascending: false }),
        supabase
          .from("profiles")
          .select("*")
          .eq("profile_id", user.id)
          .single(),
      ]);

      setBookings(bookingsRes.data ?? []);
      setProfile(profileRes.data);
      setLoading(false);
    };
    loadData();
  }, [supabase]);

  const handleCancel = async (bookingId: string) => {
    const { error } = await supabase
      .from("reservation")
      .update({ status: "cancelled" })
      .eq("reservation_id", bookingId);
    if (error) {
      toast.error("Failed to cancel booking");
      return;
    }
    toast.success("Booking cancelled successfully");
    setBookings((prev) =>
      prev.map((b) =>
        b.reservation_id === bookingId ? { ...b, status: "cancelled" } : b,
      ),
    );
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

  const past = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b.status === "completed" ||
          b.status === "cancelled" ||
          b.status === "no_show" ||
          (b.reservation_date && isPast(parseISO(b.reservation_date))),
      ),
    [bookings],
  );

  // Derived stats
  const lastVisit = useMemo(() => {
    const completed = bookings.find((b) => b.status === "completed");
    if (!completed?.reservation_date) return "No visits yet";
    return format(parseISO(completed.reservation_date), "MMM d, yyyy");
  }, [bookings]);

  const favoriteService = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      const name = b.booking_items?.[0]?.services?.service_name;
      if (name) counts[name] = (counts[name] || 0) + 1;
    });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : "Book to start!";
  }, [bookings]);

  const nextAppointment = useMemo(() => upcoming[0] ?? null, [upcoming]);

  const favoriteServicesList = useMemo(() => {
    const counts: Record<string, { service: any; count: number }> = {};
    bookings.forEach((b) => {
      const service = b.booking_items?.[0]?.services;
      if (service?.service_name) {
        if (!counts[service.service_name]) {
          counts[service.service_name] = { service, count: 0 };
        }
        counts[service.service_name].count++;
      }
    });
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [bookings]);

  const recentHistory = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "completed" && b.reservation_date)
        .slice(0, 3),
    [bookings],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold">
              Welcome back, {profile?.first_name ?? "there"}!
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Ready for your next glow-up?
            </p>
          </div>
          <Link
            href="/book"
            className={buttonVariants({
              className:
                "gradient-brand text-white border-0 shrink-0 shadow-sm hover:opacity-90 transition-opacity",
            })}
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Book Appointment</span>
            <span className="sm:hidden">Book</span>
          </Link>
        </div>
      </motion.div>

      {/* ── Next Appointment Banner ── */}
      {nextAppointment && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Link href="/book" className="block group">
            <div className="rounded-xl bg-[#494136] text-[#fafafa] px-5 py-4 flex items-center justify-between gap-4 shadow-md hover:shadow-lg hover:bg-[#3a342c] transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#fafafa]/10 flex items-center justify-center shrink-0">
                  <CalendarClock className="w-5 h-5 text-[#fafafa]" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#fafafa]/60 mb-0.5">
                    Next Appointment
                  </p>
                  <p className="font-semibold text-sm">
                    {nextAppointment.booking_items?.[0]?.services
                      ?.service_name || "Appointment"}{" "}
                    &mdash;{" "}
                    {nextAppointment.reservation_date
                      ? format(
                          parseISO(nextAppointment.reservation_date),
                          "MMM d",
                        )
                      : ""}
                    {nextAppointment.start_time &&
                      (() => {
                        const d = new Date(nextAppointment.start_time!);
                        const h = d.getHours(),
                          m = d.getMinutes();
                        const period = h >= 12 ? "PM" : "AM";
                        return `, ${h % 12 || 12}:${String(m).padStart(2, "0")} ${period}`;
                      })()}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#fafafa]/60 group-hover:text-[#fafafa] group-hover:translate-x-1 transition-all duration-200" />
            </div>
          </Link>
        </motion.div>
      )}

      {/* ── Stat Cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="border-border/30 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-default">
            <CardContent className="p-4 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <History className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Last Visit
                </p>
                <p className="font-bold text-sm mt-0.5 text-foreground">
                  {lastVisit}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/30 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-default">
            <CardContent className="p-4 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1">
              <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Favorite Service
                </p>
                <p className="font-bold text-sm mt-0.5 text-foreground truncate max-w-[160px]">
                  {favoriteService}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/30 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-default">
            <CardContent className="p-4 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <CalendarClock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Upcoming
                </p>
                <p className="font-bold text-2xl mt-0.5 text-blue-600">
                  {upcoming.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* ── Main Tabs ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-5">
            <TabsTrigger value="upcoming">
              Upcoming{" "}
              {upcoming.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#494136] text-[#fafafa] text-[10px] font-bold">
                  {upcoming.length}
                  </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="w-3.5 h-3.5" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="basket" className="flex items-center gap-2">
              <ShoppingBasket className="w-3.5 h-3.5" />
              Basket
              {basketItems.length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold">
                  {basketItems.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcoming.length === 0 ? (
              <div className="text-center py-14 space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold">No upcoming appointments</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Treat yourself — book your next visit now.
                  </p>
                </div>
                <Link
                  href="/book"
                  className={buttonVariants({
                    className:
                      "gradient-brand text-white border-0 shadow-sm hover:opacity-90 transition-opacity",
                  })}
                >
                  Book Appointment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                {/* Recent History Preview when no upcoming */}
                {recentHistory.length > 0 && (
                  <div className="mt-8 text-left border rounded-xl border-border/30 overflow-hidden shadow-sm">
                    <div className="px-4 py-3 bg-muted/30 border-b border-border/30">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Your Recent Visits
                      </p>
                    </div>
                    {recentHistory.map((b) => (
                      <div
                        key={b.reservation_id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors duration-150 gap-3 border-b border-border/20 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-[#494136]/10 flex items-center justify-center shrink-0">
                            <Scissors className="w-3.5 h-3.5 text-[#494136]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {b.booking_items?.[0]?.services?.service_name ||
                                "Salon Service"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {b.reservation_date
                                ? format(
                                    parseISO(b.reservation_date),
                                    "MMM d, yyyy",
                                  )
                                : ""}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-[10px] status-completed shrink-0"
                        >
                          Completed
                        </Badge>
                      </div>
                    ))}
                    <div className="px-4 py-3">
                      <Link
                        href="/dashboard/history"
                        className="text-xs font-semibold text-[#494136] hover:underline flex items-center gap-1"
                      >
                        View full history <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((booking, i) => (
                  <motion.div
                    key={booking.reservation_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <BookingCard booking={booking} onCancel={handleCancel} />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            {favoriteServicesList.length === 0 ? (
              <div className="text-center py-14 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                  <Star className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="font-semibold">No favorites yet</p>
                <p className="text-sm text-muted-foreground">
                  Your most booked services will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteServicesList.map(({ service, count }, i) => (
                  <motion.div
                    key={service.service_name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="border-border/30 hover:border-amber-200 transition-colors duration-200">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                            <Scissors className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{service.service_name}</p>
                            <p className="text-xs text-muted-foreground">Chosen {count} times</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-full text-amber-600" asChild>
                          <Link href="/book">Book Again</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Basket Tab */}
          <TabsContent value="basket">
            {basketItems.length === 0 ? (
              <div className="text-center py-14 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                  <ShoppingBasket className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold">Your basket is empty</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    See something you like? Add it to your basket.
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/services">Browse Services</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {basketItems.map((item, i) => (
                  <motion.div
                    key={`${item.id}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="border-border/40">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Tag className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{item.name}</p>
                            <p className="font-bold text-xs text-primary">₱{item.price?.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="text-destructive w-8 h-8"
                             onClick={() => {
                               const newBasket = basketItems.filter((_, idx) => idx !== i);
                               setBasketItems(newBasket);
                               localStorage.setItem("salon_basket", JSON.stringify(newBasket));
                             }}
                           >
                             <Trash2 className="w-4 h-4" />
                           </Button>
                           <Button size="sm" className="rounded-full h-8 px-4" asChild>
                             <Link href="/book">Book Now</Link>
                           </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold block">Total Est.</span>
                    <span className="text-lg font-bold">₱{basketItems.reduce((acc, item) => acc + (item.price || 0), 0).toLocaleString()}</span>
                  </div>
                  <Button className="gradient-brand border-0 text-white shadow-md shadow-primary/20" asChild>
                    <Link href="/book">Continue to Booking</Link>
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
