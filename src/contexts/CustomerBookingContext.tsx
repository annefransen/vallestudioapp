"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";

export type ServiceItem = {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  type: "service" | "promo";
  category: string;
};

export type StylistItem = {
  id: string;
  name: string;
  specialty?: string | null;
};

export type CustomerInfo = {
  contact_number: any;
  first_name: string;
  last_name: string;
  gmail: string;
  phone: string;
  notes: string;
};

interface CustomerBookingContextType {
  selectedServices: ServiceItem[];
  addService: (service: ServiceItem) => void;
  removeService: (id: string) => void;
  toggleService: (service: ServiceItem) => void;
  selectedStylist: StylistItem | null;
  setStylist: (stylist: StylistItem | null) => void;
  selectedDate: Date | null;
  setDate: (date: Date | null) => void;
  selectedTime: string | null;
  setTime: (time: string | null) => void;
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  getTotalPrice: () => number;
  getTotalDuration: () => number;
  resetBooking: () => void;
  profileLoading: boolean;
  profileId: string | null;
  isPageLoading: boolean;
  setIsPageLoading: (loading: boolean) => void;
}

const CustomerBookingContext = createContext<
  CustomerBookingContextType | undefined
>(undefined);

export function CustomerBookingProvider({ children }: { children: ReactNode }) {
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [selectedStylist, setStylist] = useState<StylistItem | null>(null);
  const [selectedDate, setDate] = useState<Date | null>(null);
  const [selectedTime, setTime] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    first_name: "",
    last_name: "",
    gmail: "",
    phone: "",
    contact_number: "",
    notes: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setProfileId(user.id);
          const { data } = await supabase
            .from("profiles")
            .select("first_name, last_name, phone")
            .eq("profile_id", user.id)
            .single();
          if (data) {
            setCustomerInfo({
              first_name: data.first_name ?? "",
              last_name: data.last_name ?? "",
              gmail: user.email ?? "",
              phone: data.phone ?? "",
              contact_number: data.phone ?? "",
              notes: "",
            });
          } else {
            setCustomerInfo((prev) => ({
              ...prev,
              gmail: user.email ?? "",
            }));
          }
        }
      } catch (e) {
        console.error("Failed to load profile:", e);
      } finally {
        setProfileLoading(false);
      }
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addService = (service: ServiceItem) =>
    setSelectedServices((prev) =>
      prev.find((s) => s.id === service.id) ? prev : [...prev, service],
    );

  const removeService = (id: string) =>
    setSelectedServices((prev) => prev.filter((s) => s.id !== id));

  const toggleService = (service: ServiceItem) => {
    if (selectedServices.find((s) => s.id === service.id)) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };

  const getTotalPrice = () => selectedServices.reduce((t, s) => t + s.price, 0);
  const getTotalDuration = () =>
    selectedServices.reduce((t, s) => t + s.duration, 0);

  const resetBooking = () => {
    setSelectedServices([]);
    setStylist(null);
    setDate(null);
    setTime(null);
    setCustomerInfo((prev) => ({ ...prev, notes: "" }));
  };

  return (
    <CustomerBookingContext.Provider
      value={{
        selectedServices,
        addService,
        removeService,
        toggleService,
        selectedStylist,
        setStylist,
        selectedDate,
        setDate,
        selectedTime,
        setTime,
        customerInfo,
        setCustomerInfo,
        getTotalPrice,
        getTotalDuration,
        resetBooking,
        profileLoading,
        profileId,
        isPageLoading,
        setIsPageLoading,
      }}
    >
      {children}
    </CustomerBookingContext.Provider>
  );
}

export function useCustomerBooking() {
  const ctx = useContext(CustomerBookingContext);
  if (!ctx)
    throw new Error(
      "useCustomerBooking must be used within CustomerBookingProvider",
    );
  return ctx;
}
