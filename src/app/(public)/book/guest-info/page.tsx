"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useBooking } from '@/contexts/BookingContext';
import { toast } from 'sonner';

export default function GuestInfoPage() {
  const router = useRouter();
  const { guestInfo, setGuestInfo, selectedTime, selectedServices } = useBooking();
  
  useEffect(() => {
    if (selectedServices.length === 0 || !selectedTime) {
      router.replace("/book/services");
    }
  }, [selectedServices, selectedTime, router]);

  const details = guestInfo || { first_name: '', last_name: '', gmail: '', contact_number: '' };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestInfo({ ...details, [e.target.name]: e.target.value });
  };

  const handleBookAnother = () => {
    toast.success('Great! Add another appointment');
    router.push('/book/services');
  };

  const handleProceedToPayment = () => {
    if (!details.first_name || !details.last_name || !details.gmail || !details.contact_number) {
      toast.error('Please fill in all contact details');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(details.gmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    router.push('/book/payment');
  };

  if (selectedServices.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Your Information</h2>
        <p className="text-gray-600">
          Please provide your contact information
        </p>
      </div>

      <Card className="mb-8 border-gray-200">
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>
            We'll use this information to send you booking confirmations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="Maria"
                value={details.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Santos"
                value={details.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gmail">Email Address</Label>
            <Input
              id="gmail"
              name="gmail"
              type="email"
              placeholder="maria@example.com"
              value={details.gmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_number">Contact Number</Label>
            <Input
              id="contact_number"
              name="contact_number"
              type="tel"
              placeholder="+63 912 345 6789"
              value={details.contact_number}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Card className="cursor-pointer hover:border-black transition-colors bg-gray-50/50" onClick={handleBookAnother}>
          <CardContent className="pt-6">
            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3 text-black">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-1">Book Another Appointment</h3>
              <p className="text-sm text-gray-600">Add more services to your booking</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer border-black bg-black text-white hover:bg-black/90 transition-colors" onClick={handleProceedToPayment}>
          <CardContent className="pt-6">
            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Proceed to Payment</h3>
              <p className="text-sm text-white/80">Complete your booking now</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 border-t pt-6 border-gray-200">
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push('/book/datetime')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Date & Time
        </Button>
        <Button size="lg" className="w-full sm:w-auto" onClick={handleProceedToPayment}>
          Continue to Payment
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
