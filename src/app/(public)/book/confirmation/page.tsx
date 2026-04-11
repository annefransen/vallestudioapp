"use client";

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { CheckCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useBooking } from '@/contexts/BookingContext';

export default function ConfirmationPage() {
  const { selectedServices, selectedDate, selectedTime, getTotalPrice, resetBooking } = useBooking();
  const router = useRouter();
  const [ticketId, setTicketId] = useState("");

  useEffect(() => {
    if (selectedServices.length === 0) {
      router.replace('/book/services');
    }
  }, [selectedServices, router]);

  useEffect(() => {
    if (selectedServices.length > 0) {
      const timer = setTimeout(() => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        setTicketId(`VS-${randomString}`);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [selectedServices]);

  const handleNewBooking = () => {
    resetBooking();
    router.replace('/book/services');
  };

  const handleHome = () => {
    resetBooking();
    router.replace('/');
  };

  if (selectedServices.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto -mt-6 mb-24">
      {/* Success Icon */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <CheckCircle className="w-12 h-12 text-black" />
        </div>
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Booking Confirmed!</h2>
        <p className="text-gray-600">
          Your appointment has been successfully booked and payment confirmed.
        </p>
      </div>

      {/* Booking Details */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="pt-6 space-y-6">
          <div className="text-center border-b pb-4">
            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">Booking Reference</p>
            <p className="text-2xl font-mono font-bold tracking-wider">{ticketId}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Appointment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium text-right">
                  {selectedDate?.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })} at {selectedTime}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Services Booked</h3>
            <div className="space-y-2">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span>{service.name}</span>
                  <span className="font-medium">₱{service.price}</span>
                </div>
              ))}
              <div className="flex justify-between text-lg font-semibold pt-4">
                <span>Total Paid via GCash</span>
                <span className="text-foreground">₱{getTotalPrice()}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Important:</strong> Please arrive 10 minutes before your appointment time. 
              A confirmation email and SMS has been sent to your provided contact details.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button size="lg" className="flex-1 w-full" onClick={handleNewBooking}>
          Book Another Appointment
        </Button>
      </div>

      <div className="text-center">
        <Button variant="ghost" onClick={handleHome}>
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
