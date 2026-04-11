"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type ServiceItem = {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  type: "service" | "promo";
};

export const SERVICES: ServiceItem[] = [
  { id: "haircut-blowdry", name: "Hair Cut w/ Blow Dry", price: 149, duration: 45, description: "Precision cut with a professional blowout.", type: "service" },
  { id: "hair-wash-cut", name: "Hair Wash / Dry & Cut", price: 199, duration: 60, description: "Refreshing wash, precision cut, and styling.", type: "service" },
  { id: "hair-spa", name: "Hair Spa + Cut", price: 299, duration: 90, description: "Deep conditioning spa treatment with a cut.", type: "service" },
  { id: "color", name: "Full Hair Color", price: 599, duration: 120, description: "Vibrant full color transformation.", type: "service" },
  { id: "gel-mani", name: "Gel Manicure", price: 350, duration: 60, description: "Long-lasting gel polish manicure.", type: "service" },
];

export const PROMOS: ServiceItem[] = [
  { id: "promo-rebond-color", name: "Rebond + Color Combo", price: 1299, duration: 180, description: "Complete hair makeover package.", type: "promo" },
  { id: "promo-mani-pedi", name: "Mani & Pedi Luxe", price: 250, duration: 90, description: "Relaxing manicure and pedicure bundle.", type: "promo" },
];

export type GuestInfo = {
  first_name: string;
  last_name: string;
  gmail: string;
  contact_number: string;
};

interface BookingContextType {
  selectedServices: ServiceItem[];
  addService: (service: ServiceItem) => void;
  removeService: (id: string) => void;
  
  selectedDate: Date | null;
  setDate: (date: Date | null) => void;
  
  selectedTime: string | null;
  setTime: (time: string | null) => void;
  
  guestInfo: GuestInfo | null;
  setGuestInfo: (info: GuestInfo | null) => void;
  
  getTotalPrice: () => number;
  getTotalDuration: () => number;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [selectedDate, setDate] = useState<Date | null>(new Date());
  const [selectedTime, setTime] = useState<string | null>(null);
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);

  const addService = (service: ServiceItem) => {
    setSelectedServices((prev) => [...prev, service]);
  };

  const removeService = (id: string) => {
    setSelectedServices((prev) => prev.filter((s) => s.id !== id));
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  };

  const getTotalDuration = () => {
    return selectedServices.reduce((total, service) => total + service.duration, 0);
  };

  const resetBooking = () => {
    setSelectedServices([]);
    setDate(new Date());
    setTime(null);
    setGuestInfo(null);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedServices,
        addService,
        removeService,
        selectedDate,
        setDate,
        selectedTime,
        setTime,
        guestInfo,
        setGuestInfo,
        getTotalPrice,
        getTotalDuration,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
