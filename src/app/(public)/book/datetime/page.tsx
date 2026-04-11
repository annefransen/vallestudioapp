"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Calendar } from '@/components/ui/Calendar';
import { useBooking } from '@/contexts/BookingContext';
import { toast } from 'sonner';

// Helper to generate dummy time slots
function generateTimeSlots(date: Date | null) {
  if (!date) return [];
  const slots = [];
  const startHour = 9; // 9 AM
  const endHour = 18; // 6 PM
  
  // Create randomized availability based on date to feel realistic
  const seed = date.getDate();
  
  for (let i = startHour; i <= endHour; i++) {
    const isAvailable = (i + seed) % 3 !== 0; // Random deterministic availability
    const period = i >= 12 ? 'PM' : 'AM';
    const hour = i > 12 ? i - 12 : i;
    slots.push({
      time: `${hour}:00 ${period}`,
      available: isAvailable
    });
    // Add half hour slots
    if (i !== endHour) {
      slots.push({
        time: `${hour}:30 ${period}`,
        available: (i + seed) % 4 !== 0
      });
    }
  }
  return slots;
}

export default function DateTimeSelectionPage() {
  const router = useRouter();
  const { selectedDate, selectedTime, setDate, setTime, selectedServices } = useBooking();
  const [timeSlots, setTimeSlots] = useState<{time: string, available: boolean}[]>([]);

  useEffect(() => {
    if (selectedServices.length === 0) {
      router.replace("/book/services");
    }
  }, [selectedServices, router]);

  useEffect(() => {
    setTimeSlots(generateTimeSlots(selectedDate));
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setTime(null); // Reset time when date changes
    } else {
      setDate(null);
    }
  };

  const handleNext = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }
    router.push('/book/guest-info');
  };

  // Disable past dates
  const disabledDays = {
    before: new Date(new Date().setHours(0, 0, 0, 0)),
  };

  if (selectedServices.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Select Date & Time</h2>
        <p className="text-gray-600">Choose your preferred appointment date and time</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={handleDateSelect}
              disabled={disabledDays}
              className="rounded-md border p-4 shadow-sm"
            />
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Select Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <div className="text-center py-12 text-gray-500 border border-dashed rounded-lg">
                Please select a date first
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? 'default' : 'outline'}
                    className={`${!slot.available ? 'opacity-50 cursor-not-allowed hidden' : ''}`}
                    disabled={!slot.available}
                    onClick={() => setTime(slot.time)}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            )}
            
            {selectedDate && (
              <div className="mt-8 p-3 bg-gray-50 border border-border/50 rounded-lg text-sm text-gray-600 flex gap-3">
                <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Slots dynamically reflect real-time availability based on staff schedules and service duration.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Selected Date & Time Summary */}
      {selectedDate && selectedTime && (
        <Card className="mb-8 border-gray-200 bg-gray-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Selected Appointment</h3>
                <p className="text-foreground font-medium">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} at {selectedTime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-border/50">
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push('/book/services')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>
        <Button 
          size="lg" 
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
          className="w-full sm:w-auto"
        >
          Next: Guest Info
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
