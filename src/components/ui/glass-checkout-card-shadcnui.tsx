"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Landmark, QrCode } from "lucide-react";
import { useState } from "react";

interface GlassCheckoutCardProps {
  amount?: number;
  className?: string;
  onPaymentComplete?: (method: string) => void;
}

const PAYMENT_METHODS = [
  { id: "gcash", label: "GCash", icon: <Wallet className="h-4 w-4" /> },
  { id: "bpi", label: "BPI", icon: <Landmark className="h-4 w-4" /> },
  { id: "bdo", label: "BDO", icon: <Landmark className="h-4 w-4" /> },
  { id: "gotyme", label: "GoTyme", icon: <QrCode className="h-4 w-4" /> },
];

export function GlassCheckoutCard({
  amount = 85.8,
  className,
  onPaymentComplete,
}: GlassCheckoutCardProps) {
  const [paymentMethod, setPaymentMethod] = useState("gcash");

  const handlePay = () => {
    onPaymentComplete?.(paymentMethod);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("w-full max-w-[500px]", className)}
    >
      <Card className="group relative overflow-hidden rounded-3xl border-border/50 bg-background/30 backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 p-8">
        <div className="relative z-10">
          <div className="mb-8">
            <h3 className="text-2xl font-serif font-medium text-foreground tracking-tight">
              Secure Checkout
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Finalize your booking with our local partners
            </p>
          </div>

          {/* Payment Methods Grid */}
          <div className="mb-8 grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={cn(
                  "flex items-center gap-3 h-14 px-4 rounded-xl border border-border/50 bg-background/50 transition-all duration-300",
                  "hover:bg-background/80 hover:border-primary/20",
                  paymentMethod === method.id 
                    ? "border-primary/50 bg-primary/5 text-primary shadow-lg shadow-primary/5 ring-1 ring-primary/20" 
                    : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  paymentMethod === method.id ? "bg-primary/10 text-primary" : "bg-muted/10"
                )}>
                  {method.icon}
                </div>
                <span className="font-medium text-sm">{method.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {paymentMethod === "gcash" ? (
                <motion.div
                  key="gcash"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="gcash-number">GCash Registered Number</Label>
                    <Input id="gcash-number" placeholder="09XX XXX XXXX" className="h-12 bg-background/40" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="bank"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="account-name">Account Name</Label>
                    <Input id="account-name" placeholder="John Doe" className="h-12 bg-background/40" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input id="account-number" placeholder="XXXX XXXX XXXX" className="h-12 bg-background/40" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-8 border-t border-border/50">
            <div className="flex justify-between items-end mb-6">
              <span className="text-muted-foreground text-sm font-medium uppercase tracking-widest">Total Amount</span>
              <span className="text-3xl font-serif font-medium leading-none">₱{amount.toFixed(2)}</span>
            </div>
            
            <Button 
              size="lg"
              onClick={handlePay}
              className="w-full h-14 text-base font-medium rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Complete Booking
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
            <Landmark className="inline-block h-3.5 w-3.5 mr-1.5 opacity-70" />
            Proceeding will connect you to our secure payment portal
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
      </Card>
    </motion.div>
  );
}
