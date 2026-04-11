"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Calendar, Clock, User, Scissors, Landmark, Bell } from "lucide-react";
import { ServiceItem } from "@/contexts/BookingContext";
import { Button } from "@/components/ui/Button";

const DashedLine = () => (
  <div
    className="w-full border-t border-dashed border-border/60 my-6"
    aria-hidden="true"
  />
);

export interface TicketProps extends React.HTMLAttributes<HTMLDivElement> {
  ticketId: string;
  amount: number;
  duration: number;
  date: Date;
  time?: string;
  services: ServiceItem[];
  details: {
    first_name: string;
    last_name: string;
    gmail: string;
    contact_number: string;
  };
}

const AnimatedTicket = React.forwardRef<HTMLDivElement, TicketProps>(
  (
    {
      className,
      ticketId,
      amount,
      duration,
      date,
      time,
      services,
      details,
      ...props
    },
    ref
  ) => {
    const formattedAmount = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);

    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "full",
    }).format(date);

    return (
      <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Success Header Area */}
        <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#E8F3E9] flex items-center justify-center mb-6 ring-8 ring-white shadow-xl shadow-black/5">
                <CheckCircle2 className="w-8 h-8 text-[#2E6B38]" strokeWidth={2} />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-medium tracking-tight mb-3">Booking Confirmed</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              You are all set, {details.first_name}. Your appointment details have been successfully recorded.
            </p>
        </div>

        {/* Confirmation Card */}
        <div
          ref={ref}
          className={cn(
            "relative w-full max-w-[480px] bg-white rounded-[2rem] border border-border/40 shadow-2xl shadow-black/5 font-sans z-10 overflow-hidden",
            className
          )}
          {...props}
        >
          {/* Top Notch Decorative */}
          <div className="h-2 w-full bg-[#E8F3E9]" />
          
          <div className="p-8 sm:p-10">
              
              <div className="flex justify-between items-start gap-4 mb-8">
                  <div className="space-y-1">
                      <p className="text-[0.625rem] text-muted-foreground uppercase tracking-widest font-semibold">Booking ID</p>
                      <p className="font-mono text-sm tracking-tighter bg-muted/40 px-2 py-0.5 rounded-md inline-block">{ticketId}</p>
                  </div>
                  <div className="text-right space-y-1">
                      <p className="text-[0.625rem] text-muted-foreground uppercase tracking-widest font-semibold">Total Paid</p>
                      <p className="font-serif text-2xl font-medium text-[#2E6B38]">{formattedAmount}</p>
                  </div>
              </div>

              {/* Schedule */}
              <div className="bg-muted/30 p-5 rounded-2xl border border-border/40 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white border border-border/60 flex items-center justify-center shrink-0 shadow-sm">
                      <Calendar className="w-5 h-5 opacity-60" />
                  </div>
                  <div>
                      <p className="font-medium">{formattedDate}</p>
                      <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
                          {time} <span className="opacity-50 mx-1">•</span> <Clock className="w-3.5 h-3.5" /> {duration} mins
                      </p>
                  </div>
              </div>

              <DashedLine />

              {/* Services List */}
              <div className="space-y-3">
                  <p className="text-[0.625rem] text-muted-foreground uppercase tracking-widest font-semibold">Treatments Reserved</p>
                  <div className="space-y-2">
                     {services.map((s, idx) => (
                        <div key={idx} className="flex justify-between items-start text-sm">
                           <span className="flex items-start gap-2 max-w-[75%] font-medium">
                              <Scissors className="w-3.5 h-3.5 mt-0.5 opacity-50 shrink-0" /> {s.name}
                           </span>
                           <span className="text-muted-foreground">₱{s.price}</span>
                        </div>
                     ))}
                  </div>
              </div>

              <DashedLine />

              {/* Guest Details */}
              <div className="space-y-4">
                  <p className="text-[0.625rem] text-muted-foreground uppercase tracking-widest font-semibold">Guest Information</p>
                  <div className="flex gap-4 items-start">
                     <div className="w-8 h-8 rounded-full bg-muted border border-border/60 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 opacity-50" />
                     </div>
                     <div className="text-sm">
                        <p className="font-medium">{details.first_name} {details.last_name}</p>
                        <p className="text-muted-foreground mt-0.5">{details.gmail}</p>
                        <p className="text-muted-foreground">{details.contact_number}</p>
                     </div>
                  </div>
              </div>

              {/* Additional Context */}
              <div className="flex flex-col gap-2 mt-6 p-4 rounded-xl border border-border/50 text-sm bg-[#faf9f6]">
                  <div className="flex items-center gap-2">
                     <Landmark className="w-4 h-4 opacity-40 shrink-0" />
                     <span className="text-muted-foreground">Payment verified via Online Gateway</span>
                  </div>
              </div>

              <DashedLine />

              {/* Reminder Section */}
              <div className="flex gap-3 text-sm items-start text-[#615C4B] bg-[#F7F6EE] p-4 rounded-xl border border-[#EBE8D8]">
                 <Bell className="w-5 h-5 shrink-0 mt-0.5" />
                 <p className="leading-relaxed">
                   Please arrive <strong>10 minutes early</strong> for your appointment. Check your email for further instructions.
                 </p>
              </div>

          </div>
        </div>

        {/* Post-Booking Actions */}
        <div className="mt-12 flex flex-col items-center gap-4 w-full max-w-sm">
            <Button 
                className="w-full h-14 rounded-2xl bg-foreground text-background shadow-xl hover:scale-[1.02] transition-transform text-md font-medium"
                onClick={() => window.location.href = "/register"}
            >
                Create Account to Track Bookings
            </Button>
            <Button 
                variant="outline"
                className="w-full h-14 rounded-2xl border-border/50 hover:bg-white text-md shadow-sm bg-white/60"
                onClick={() => window.location.href = "/book"}
            >
                Book Another Appointment
            </Button>
            <Button 
                variant="ghost" 
                className="text-muted-foreground mt-2"
                onClick={() => window.location.href = "/"}
            >
                Back to Home
            </Button>
        </div>
      </div>
    );
  }
);

AnimatedTicket.displayName = "AnimatedTicket";

export { AnimatedTicket };
