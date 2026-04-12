import React from "react";
import { cn } from "@/lib/utils";

/**
 * Skeleton — base animated shimmer block (snappy speed)
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-stone-100",
        className,
      )}
      style={{ isolation: "isolate" }}
    >
      <div
        className="absolute inset-0 -translate-x-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
          animation: "skeleton-shimmer 0.3s infinite",
        }}
      />
    </div>
  );
}

/**
 * Global CSS animation — add to globals.css if not present.
 * @keyframes shimmer { 100% { transform: translateX(100%); } }
 */

/* ── Page Skeletons ──────────────────────────────────────── */

/** Shared container for all booking step skeletons to keep animations synchronized */
function SharedBookingStepSkeleton({
  children,
  showHeader = true,
}: {
  children: React.ReactNode;
  showHeader?: boolean;
}) {
  return (
    <div className="max-w-6xl mx-auto pb-36 mt-8 px-6 sm:px-0 space-y-8">
      {/* Multistep progress bar skeleton */}
      <div className="mb-8 flex items-center justify-between">
        {[...Array(5)].map((_, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-1.5">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="hidden sm:block h-2.5 w-12" />
            </div>
            {i < 4 && (
              <div className="flex-1 mx-2 mb-4 sm:mb-0">
                <Skeleton className="h-px w-full" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {showHeader && (
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-3" />
          <Skeleton className="h-4 w-80" />
        </div>
      )}

      {children}
    </div>
  );
}

/** Dashboard Home skeleton */
export function DashboardHomeSkeleton() {
  return (
    <div className="space-y-8 pb-6">
      {/* Greeting */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Next Appointment card */}
      <section>
        <Skeleton className="h-3.5 w-32 mb-3" />
        <div className="rounded-xl border border-stone-200 bg-white shadow-sm p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="pt-4 border-t border-stone-100 flex gap-6">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16 ml-auto" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-8 w-36 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section>
        <Skeleton className="h-3.5 w-28 mb-3" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-stone-200 bg-white p-4 space-y-2"
            >
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-10" />
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <Skeleton className="h-3.5 w-28 mb-3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-stone-200 bg-white px-5 py-4 flex items-center gap-3"
            >
              <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-44" />
              </div>
              <Skeleton className="w-4 h-4 rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Appointments page skeleton */
export function AppointmentsSkeleton() {
  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full" />
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-stone-200 bg-white p-5 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="pt-3 border-t border-stone-100 flex flex-wrap gap-5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** History page skeleton */
export function HistorySkeleton() {
  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-52" />
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-stone-200 bg-white p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Profile page skeleton */
export function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-6">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Avatar card */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 flex flex-col items-center gap-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="space-y-2 text-center">
          <Skeleton className="h-5 w-36 mx-auto" />
          <Skeleton className="h-3.5 w-48 mx-auto" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Personal info card */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-5">
        <Skeleton className="h-5 w-36" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/** Book Appointment page skeleton */
export function BookAppointmentSkeleton() {
  return (
    <SharedBookingStepSkeleton>
      {/* Category filter pills */}
      <div className="flex gap-2 mb-10 flex-wrap">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-lg" />
        ))}
      </div>

      {/* Service card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-md p-6 shadow-sm border-2 border-transparent space-y-4"
          >
            <Skeleton className="h-5 w-36" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </SharedBookingStepSkeleton>
  );
}

/** Book Stylist page skeleton */
export function BookStylistSkeleton() {
  return (
    <SharedBookingStepSkeleton>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-stone-100 bg-white space-y-3"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-5 border-t border-stone-100">
        <Skeleton className="h-10 w-36 rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
    </SharedBookingStepSkeleton>
  );
}

/** Book Date & Time page skeleton */
export function BookDateTimeSkeleton() {
  return (
    <SharedBookingStepSkeleton>
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="rounded-xl bg-white shadow-sm border border-stone-100 p-8 w-full max-w-sm">
          <Skeleton className="h-[280px] w-full" />
        </div>

        <div className="flex-1 space-y-3">
          <Skeleton className="h-3 w-32 mb-3" />
          <div className="grid grid-cols-3 gap-2.5">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 mt-6 border-t border-stone-100">
        <Skeleton className="h-10 w-36 rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
    </SharedBookingStepSkeleton>
  );
}

/** Book Info page skeleton */
export function BookInfoSkeleton() {
  return (
    <SharedBookingStepSkeleton>
      <div className="max-w-xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 mt-6 border-t border-stone-100">
        <Skeleton className="h-10 w-36 rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
    </SharedBookingStepSkeleton>
  );
}

/** Book Payment page skeleton */
export function BookPaymentSkeleton() {
  return (
    <SharedBookingStepSkeleton>
      <div className="max-w-xl bg-white rounded-xl border border-stone-100 p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3.5 w-16" />
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-stone-100 flex justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 mt-6 border-t border-stone-100">
        <Skeleton className="h-10 w-36 rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
    </SharedBookingStepSkeleton>
  );
}
