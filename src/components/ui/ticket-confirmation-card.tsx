"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Ticket, Calendar, User, CreditCard } from "lucide-react";

const DashedLine = () => (
  <div
    className="w-full border-t-2 border-dashed border-border/50 my-6"
    aria-hidden="true"
  />
);

const BARS = Array.from({ length: 45 }).map(() => ({
  width: Math.random() > 0.6 ? 3 : 1.5,
}));

const Barcode = ({ value }: { value: string }) => {
    return (
        <div className="flex flex-col items-center py-4 bg-muted/20 rounded-xl">
             <svg
                xmlns="http://www.w3.org/2000/svg"
                width="280"
                height="60"
                viewBox="0 0 280 60"
                className="fill-current text-foreground/80 overflow-visible"
            >
                {BARS.map((bar, index) => (
                    <rect
                        key={index}
                        x={index * 6}
                        y="0"
                        width={bar.width}
                        height="60"
                    />
                ))}
            </svg>
            <p className="text-[10px] text-muted-foreground tracking-[0.8em] mt-3 font-mono uppercase">{value}</p>
        </div>
    );
};

const COLORS = ["#d4af37", "#f3efee", "#1a1a1a", "#e5e7eb"];
const CONFETTI_PIECES = Array.from({ length: 40 }).map((_, i) => ({
  left: `${Math.random() * 100}%`,
  top: `${-20 + Math.random() * 10}%`,
  backgroundColor: COLORS[i % COLORS.length],
  rotate: `${Math.random() * 360}deg`,
  fallDuration: 3 + Math.random() * 3,
  fallDelay: Math.random() * 2
}));

const ConfettiExplosion = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <style>
        {`
          @keyframes fall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
          }
        `}
      </style>
      {CONFETTI_PIECES.map((p, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-3"
          style={{
            left: p.left,
            top: p.top,
            backgroundColor: p.backgroundColor,
            transform: `rotate(${p.rotate})`,
            animation: `fall ${p.fallDuration}s ${p.fallDelay}s ease-in-out forwards`,
          }}
        />
      ))}
    </div>
  );
};

export interface TicketProps extends React.HTMLAttributes<HTMLDivElement> {
  ticketId: string;
  amount: number;
  date: Date;
  time?: string;
  cardHolder: string;
  last4Digits: string;
  barcodeValue: string;
}

const AnimatedTicket = React.forwardRef<HTMLDivElement, TicketProps>(
  (
    {
      className,
      ticketId,
      amount,
      date,
      time,
      cardHolder,
      last4Digits,
      barcodeValue,
      ...props
    },
    ref
  ) => {
    const [showConfetti, setShowConfetti] = React.useState(false);

    React.useEffect(() => {
      const timer = setTimeout(() => setShowConfetti(true), 200);
      return () => clearTimeout(timer);
    }, []);

    const formattedAmount = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);

    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);

    return (
      <div className="flex flex-col items-center w-full">
        {showConfetti && <ConfettiExplosion />}
        <div
          ref={ref}
          className={cn(
            "relative w-full max-w-[420px] bg-card text-card-foreground rounded-[2.5rem] shadow-2xl font-sans z-10 overflow-hidden",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-8 duration-700 pb-8",
            className
          )}
          {...props}
        >
          {/* Top Notch Decorative */}
          <div className="h-4 w-full bg-primary/10" />
          
          {/* Ticket Body */}
          <div className="p-10 flex flex-col items-center text-center">
              <div className="p-4 bg-primary/5 rounded-full mb-6">
                  <CheckCircle2 className="w-12 h-12 text-primary" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-serif font-medium mb-2">Booking Confirmed</h1>
              <p className="text-muted-foreground text-sm max-w-[240px]">
                Your appointment has been successfully scheduled.
              </p>
          </div>

          <div className="px-10 space-y-6">
              <DashedLine />

              <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1.5">
                        <Ticket className="w-3 h-3" /> Booking ID
                      </p>
                      <p className="font-mono text-sm tracking-tighter">{ticketId}</p>
                  </div>
                  <div className="text-right space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Total Amount</p>
                      <p className="font-serif text-xl font-medium">{formattedAmount}</p>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> Date & Time
                    </p>
                    <p className="text-sm font-medium">{formattedDate}</p>
                    <p className="text-sm text-muted-foreground">{time}</p>
                </div>
                <div className="space-y-1 text-right">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1.5 justify-end">
                      <User className="w-3 h-3" /> Client
                    </p>
                    <p className="text-sm font-medium truncate">{cardHolder}</p>
                </div>
              </div>

              <div className="bg-muted/30 p-5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center border border-border/50">
                        <CreditCard className="w-5 h-5 opacity-40" />
                    </div>
                    <span className="text-sm font-medium tracking-tight">Payment Detail</span>
                  </div>
                  <span className="text-xs font-mono opacity-60">•••• {last4Digits}</span>
              </div>

              <DashedLine />

              <Barcode value={barcodeValue} />
          </div>

          {/* Ticket semi-circles */}
          <div className="absolute -left-5 top-[52%] -translate-y-1/2 w-10 h-10 rounded-full bg-background border-r border-border/20 z-20" />
          <div className="absolute -right-5 top-[52%] -translate-y-1/2 w-10 h-10 rounded-full bg-background border-l border-border/20 z-20" />
        </div>
      </div>
    );
  }
);

AnimatedTicket.displayName = "AnimatedTicket";

export { AnimatedTicket };
