"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scissors } from "lucide-react";

import { BookingProvider } from "@/contexts/BookingContext";

const STEPS = [
  { path: "/book/services", number: 1, label: "Services" },
  { path: "/book/datetime", number: 2, label: "Date & Time" },
  { path: "/book/guest-info", number: 3, label: "Guest Info" },
  { path: "/book/payment", number: 4, label: "Payment" },
];

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/book/confirmation") {
    return <BookingProvider>{children}</BookingProvider>;
  }

  const currentStepObj =
    STEPS.find((s) => pathname.startsWith(s.path)) || STEPS[0];
  const currentStep = currentStepObj.number;

  return (
    <BookingProvider>
      {/* Progress Bar */}
      <div className="container mx-auto px-4 pt-15 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((step, index) => {
              const isActive = step.number <= currentStep;
              const isCompleted = step.number < currentStep;

              return (
                <div
                  key={step.number}
                  className="flex items-center flex-1 last:flex-initial"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        isActive
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    <span
                      className={`text-xs mt-1 hidden sm:block ${
                        isActive ? "text-black font-medium" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="flex-1 h-1 mx-2 bg-gray-200 rounded">
                      <div
                        className="h-full bg-black rounded transition-all"
                        style={{ width: isCompleted ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </BookingProvider>
  );
}
