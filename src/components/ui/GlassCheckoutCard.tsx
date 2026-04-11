"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, CreditCard, Calendar, Clock, User, Scissors } from "lucide-react";
import { useState } from "react";
import { ServiceItem } from "@/contexts/BookingContext";

interface GlassCheckoutCardProps {
  amount?: number;
  duration?: number;
  services?: ServiceItem[];
  date?: Date;
  time?: string;
  guestDetails?: {
    first_name: string;
    last_name: string;
    gmail: string;
    contact_number: string;
  };
  className?: string;
  onPaymentComplete?: (method: string, ticket?: string) => void;
}

const PAYMENT_METHODS = [
  { id: "gcash", label: "GCash", icon: <Wallet className="h-4 w-4" /> },
  { id: "card", label: "Card", icon: <CreditCard className="h-4 w-4" /> },
];

export function GlassCheckoutCard({
  amount = 0,
  duration = 0,
  services = [],
  date,
  time,
  guestDetails,
  className,
  onPaymentComplete,
}: GlassCheckoutCardProps) {
  const [paymentMethod, setPaymentMethod] = useState("gcash");

  const handlePay = () => {
    onPaymentComplete?.(paymentMethod);
  };

  const formattedDate = date ? new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(date) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("w-full max-w-[800px] flex flex-col lg:flex-row gap-6", className)}
    >
      {/* Summary Card */}
      <Card className="flex-1 rounded-3xl border-border/50 bg-white/40 backdrop-blur-sm p-6 shadow-xl shadow-black/5 h-fit relative overflow-hidden">
         <div className="mb-6 relative z-10">
            <h3 className="text-xl font-serif text-foreground mb-1">Booking Summary</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Double check your details</p>
         </div>

         <div className="space-y-6 relative z-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Treatments</p>
              <div className="space-y-2">
                 {services.map((s, i) => (
                    <div key={i} className="flex justify-between items-start text-sm">
                       <span className="flex items-start gap-2 max-w-[70%]">
                          <Scissors className="w-4 h-4 mt-0.5 opacity-50 shrink-0" /> {s.name}
                       </span>
                       <span className="font-medium">₱{s.price}</span>
                    </div>
                 ))}
              </div>
            </div>

            <div className="w-full h-px bg-border/40" />

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Schedule</p>
                  <p className="text-sm font-medium flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 opacity-60" /> {formattedDate}</p>
                  <p className="text-sm text-muted-foreground ml-5">{time}</p>
               </div>
               <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1 wrap-break-word">Est. Duration</p>
                  <p className="text-sm font-medium flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 opacity-60" /> {duration} mins</p>
               </div>
            </div>

            <div className="w-full h-px bg-border/40" />

            <div>
               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Guest Information</p>
               {guestDetails && (
                 <div className="bg-muted/20 p-3 rounded-xl space-y-1 text-sm border border-border/30">
                    <p className="font-medium flex items-center gap-2"><User className="w-3.5 h-3.5 opacity-60" /> {guestDetails.first_name} {guestDetails.last_name}</p>
                    <p className="text-muted-foreground ml-5.5 pl-[22px]">{guestDetails.gmail}</p>
                    <p className="text-muted-foreground ml-5.5 pl-[22px]">{guestDetails.contact_number}</p>
                 </div>
               )}
            </div>

            <div className="pt-4 border-t border-border/40 flex justify-between items-end">
               <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Total Cost</span>
               <span className="text-3xl font-serif font-medium leading-none">₱{amount}</span>
            </div>
         </div>

         {/* Decorative element */}
         <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      </Card>

      {/* Payment Method Card */}
      <Card className="flex-[1.2] relative overflow-hidden rounded-3xl border border-border/50 bg-white shadow-2xl shadow-black/5 p-6 sm:p-8">
        <div className="relative z-10">
          <div className="mb-8">
            <h3 className="text-2xl font-serif font-medium text-foreground tracking-tight">
              Payment Data
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Finalize your booking securely
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={cn(
                  "flex items-center gap-3 h-14 px-4 rounded-xl border border-border/40 bg-background transition-all duration-300",
                  "hover:bg-muted/20 hover:border-foreground/30",
                  paymentMethod === method.id 
                    ? "border-foreground bg-foreground/5 text-foreground shadow-sm ring-1 ring-foreground pointer-events-none" 
                    : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  paymentMethod === method.id ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                )}>
                  {method.icon}
                </div>
                <span className="font-medium text-sm tracking-wide">{method.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-6 min-h-[220px]">
            <AnimatePresence mode="wait">
              {paymentMethod === "gcash" ? (
                <motion.div
                  key="gcash"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="gcash-number" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Mobile Number</Label>
                    <Input id="gcash-number" placeholder="09XX XXX XXXX" className="h-12 bg-white border-border/40 focus:border-foreground/40" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gcash-name" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Account Name</Label>
                    <Input id="gcash-name" placeholder="Juan Dela Cruz" className="h-12 bg-white border-border/40 focus:border-foreground/40" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="card-name" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Cardholder Name</Label>
                    <Input id="card-name" placeholder="John Doe" className="h-12 bg-white border-border/40 focus:border-foreground/40" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-number" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Card Number</Label>
                    <Input id="card-number" placeholder="XXXX XXXX XXXX XXXX" className="h-12 bg-white border-border/40 focus:border-foreground/40" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="card-expiry" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Expiry Date</Label>
                       <Input id="card-expiry" placeholder="MM/YY" className="h-12 bg-white border-border/40 focus:border-foreground/40" />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="card-cvv" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">CVV</Label>
                       <Input id="card-cvv" type="password" placeholder="123" className="h-12 bg-white border-border/40 focus:border-foreground/40" />
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-6 border-t border-border/40">
            <Button 
              size="lg"
              onClick={handlePay}
              className="w-full h-14 text-base font-medium rounded-2xl shadow-xl shadow-foreground/10 transition-all hover:scale-[1.01] active:scale-[0.99] group"
            >
              Pay with {paymentMethod === "gcash" ? "GCash" : "Card"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
