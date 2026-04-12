"use client";

import React from "react";
import { CustomerBookingProvider } from "@/contexts/CustomerBookingContext";

export default function CustomerBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomerBookingProvider>
      <BookingLayoutInner>{children}</BookingLayoutInner>
    </CustomerBookingProvider>
  );
}

function BookingLayoutInner({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
