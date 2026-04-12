"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { path: "/dashboard/book", number: 1, label: "Services", exact: true },
  { path: "/dashboard/book/stylist", number: 2, label: "Stylist" },
  { path: "/dashboard/book/datetime", number: 3, label: "Date & Time" },
  { path: "/dashboard/book/info", number: 4, label: "Your Info" },
  { path: "/dashboard/book/payment", number: 5, label: "Payment" },
];

export function BookingProgressBar() {
  const pathname = usePathname();

  if (pathname === "/dashboard/book/confirmation") {
    return null;
  }

  const currentStepObj = STEPS.find((s) => {
    if (s.exact) return pathname === s.path;
    return pathname.startsWith(s.path);
  }) ?? STEPS[0];
  const currentStep = currentStepObj.number;

  return (
    <div className="mb-8 flex items-center justify-between">
      {STEPS.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;

        return (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200",
                  isCompleted
                    ? "bg-[#494136] text-white"
                    : isActive
                    ? "bg-[#494136] text-white ring-4 ring-[#494136]/15"
                    : "bg-stone-100 text-stone-400 border border-stone-200"
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.number}
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold tracking-wide hidden sm:block",
                  isActive
                    ? "text-[#494136]"
                    : isCompleted
                    ? "text-stone-500"
                    : "text-stone-400"
                )}
              >
                {step.label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <div className="flex-1 mx-2 mb-4 sm:mb-0">
                <div className="h-px bg-stone-200 relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-[#494136] transition-all duration-300"
                    style={{ width: isCompleted ? "100%" : "0%" }}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
