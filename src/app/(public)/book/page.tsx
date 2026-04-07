"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ChevronLeft, 
  Scissors, 
  Calendar as CalendarIcon, 
  User, 
  CreditCard,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarScheduler } from "@/components/ui/calendar-scheduler";
import { GlassCheckoutCard } from "@/components/ui/glass-checkout-card-shadcnui";
import { AnimatedTicket } from "@/components/ui/ticket-confirmation-card";
import { cn } from "@/lib/utils";

// --- Service Data (Simplified for selection) ---
const SERVICES = [
  { id: "hair-cut", name: "Hair Cut w/ Blow Dry", price: 149, icon: <Scissors className="w-5 h-5" /> },
  { id: "hair-wash", name: "Hair Wash / Dry & Cut", price: 199, icon: <Scissors className="w-5 h-5" /> },
  { id: "hair-spa", name: "Hair Spa + Cut", price: 299, icon: <Scissors className="w-5 h-5" /> },
  { id: "color", name: "Hair Color", price: 599, icon: <Scissors className="w-5 h-5" /> },
  { id: "manicure", name: "Manicure", price: 119, icon: <User className="w-5 h-5" /> },
  { id: "pedicure", name: "Pedicure", price: 139, icon: <User className="w-5 h-5" /> },
  { id: "gel-mani", name: "Gel Mani/Pedi", price: 350, icon: <User className="w-5 h-5" /> },
  { id: "rebond", name: "Rebond", price: 899, icon: <Scissors className="w-5 h-5" /> },
];

const STEPS = [
  { id: 1, label: "Service", icon: Scissors },
  { id: 2, label: "Schedule", icon: CalendarIcon },
  { id: 3, label: "Details", icon: User },
  { id: 4, label: "Payment", icon: CreditCard },
];

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  
  // State for form data
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const [generatedTicketId, setGeneratedTicketId] = useState("");

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length + 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const progress = (currentStep / STEPS.length) * 100;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-4xl flex justify-center">
          <AnimatedTicket
            ticketId={generatedTicketId || "..."}
            amount={selectedService?.price || 0}
            date={selectedDate || new Date()}
            time={selectedTime}
            cardHolder={`${details.firstName} ${details.lastName}`}
            last4Digits="0932"
            barcodeValue="VALLESTUDIO2026"
          />
        </div>
        <div className="mt-12">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/"}
            className="rounded-2xl h-14 px-8 border-border/50 text-muted-foreground hover:text-foreground"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-sans overflow-x-hidden selection:bg-black selection:text-white">
      {/* Custom Minimalist Progress Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => window.location.href = "/"}
              className="text-sm font-bold tracking-widest uppercase hover:opacity-50 transition-opacity"
            >
              Valle Studio
            </button>
            <div className="h-4 w-px bg-border/40 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-8">
              {STEPS.map((step) => (
                <div 
                  key={step.id} 
                  className={cn(
                    "flex items-center gap-2 text-[0.6875rem] font-bold tracking-widest uppercase transition-all duration-300",
                    currentStep === step.id ? "text-foreground" : "text-muted-foreground/40"
                  )}
                >
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center border transition-all",
                    currentStep === step.id ? "bg-foreground text-background border-foreground" : "border-border/60"
                  )}>
                    {currentStep > step.id ? <Check className="w-3 h-3" /> : step.id}
                  </span>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <span className="text-[0.625rem] font-bold text-muted-foreground/60 tracking-widest uppercase sm:hidden">
              Step {currentStep} of {STEPS.length}
             </span>
             <button 
              onClick={() => window.location.href = "/"}
              className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:bg-black hover:text-white transition-all"
             >
               ×
             </button>
          </div>
        </div>
        {/* Animated Progress Line */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-foreground transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <main className="pt-32 pb-20 px-6 sm:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            >
              {currentStep === 1 && (
                <div className="space-y-12">
                  <div className="max-w-2xl">
                    <h1 className="text-5xl md:text-6xl font-serif font-medium tracking-tight leading-[1.1] mb-6">
                      Choose a <span className="italic">service</span>.
                    </h1>
                    <p className="text-lg text-muted-foreground/80 leading-relaxed font-sans">
                      Select one of our signature treatments to begin your transformation.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {SERVICES.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={cn(
                          "flex flex-col items-start p-6 rounded-3xl border transition-all duration-300 text-left group",
                          selectedService?.id === service.id
                            ? "border-foreground bg-white shadow-xl shadow-black/5"
                            : "border-border/40 bg-white/40 hover:border-foreground/30"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center mb-10 transition-all",
                          selectedService?.id === service.id ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground"
                        )}>
                          {service.icon}
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">₱{service.price}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end pt-12">
                     <Button 
                      size="lg" 
                      onClick={handleNext} 
                      disabled={!selectedService}
                      className="rounded-2xl h-14 px-10 group"
                     >
                       Next: Schedule <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                     </Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-12">
                  <div className="max-w-2xl">
                    <h1 className="text-5xl md:text-6xl font-serif font-medium tracking-tight leading-[1.1] mb-6">
                      Pick your <span className="italic">slot</span>.
                    </h1>
                  </div>

                  <div className="flex justify-center">
                    <CalendarScheduler 
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onSelect={({ date, time }) => {
                        setSelectedDate(date);
                        setSelectedTime(time);
                      }}
                      onConfirm={handleNext}
                    />
                  </div>

                  <div className="flex justify-start">
                    <Button variant="ghost" onClick={handleBack} className="text-muted-foreground">
                       <ChevronLeft className="mr-2 w-4 h-4" /> Go Back
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-12">
                  <div className="max-w-2xl">
                    <h1 className="text-5xl md:text-6xl font-serif font-medium tracking-tight leading-[1.1] mb-6">
                      A few <span className="italic">details</span>.
                    </h1>
                  </div>

                  <Card className="border-none shadow-none bg-transparent max-w-2xl mx-auto">
                    <CardContent className="p-0 space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">First Name</Label>
                          <Input 
                            id="firstName" 
                            placeholder="John" 
                            className="h-14 rounded-2xl bg-white border-border/40 focus:border-foreground/30"
                            value={details.firstName}
                            onChange={(e) => setDetails({ ...details, firstName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">Last Name</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Doe" 
                            className="h-14 rounded-2xl bg-white border-border/40 focus:border-foreground/30"
                            value={details.lastName}
                            onChange={(e) => setDetails({ ...details, lastName: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="johndoe@gmail.com" 
                          className="h-14 rounded-2xl bg-white border-border/40 focus:border-foreground/30"
                          value={details.email}
                          onChange={(e) => setDetails({ ...details, email: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">Contact Number</Label>
                        <Input 
                          id="phone" 
                          placeholder="09XX XXX XXXX" 
                          className="h-14 rounded-2xl bg-white border-border/40 focus:border-foreground/30"
                          value={details.phone}
                          onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between items-center pt-8 max-w-2xl mx-auto">
                    <Button variant="ghost" onClick={handleBack} className="text-muted-foreground">
                       <ChevronLeft className="mr-2 w-4 h-4" /> Back
                    </Button>
                    <Button 
                      size="lg" 
                      onClick={handleNext} 
                      disabled={!details.firstName || !details.email || !details.phone}
                      className="rounded-2xl h-14 px-10 group"
                     >
                       Next: Payment <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                     </Button>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-12">
                  <div className="max-w-2xl">
                    <h1 className="text-5xl md:text-6xl font-serif font-medium tracking-tight leading-[1.1] mb-6">
                      Secure <span className="italic">payment</span>.
                    </h1>
                  </div>

                  <div className="flex justify-center">
                    <GlassCheckoutCard 
                      amount={selectedService?.price || 0}
                      onPaymentComplete={(method) => {
                        console.log("Payment method:", method);
                        setGeneratedTicketId(Math.floor(Math.random() * 10000000000).toString());
                        setIsComplete(true);
                      }}
                    />
                  </div>

                  <div className="flex justify-start">
                    <Button variant="ghost" onClick={handleBack} className="text-muted-foreground">
                       <ChevronLeft className="mr-2 w-4 h-4" /> Change Details
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Background Decor */}
      <div className="fixed -bottom-64 -left-64 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -top-64 -right-64 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
