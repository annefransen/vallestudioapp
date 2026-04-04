"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CalendarSchedulerProps {
  timeSlots?: string[];
  selectedDate?: Date;
  selectedTime?: string;
  onConfirm?: (value: { date?: Date; time?: string }) => void;
  onSelect?: (value: { date?: Date; time?: string }) => void;
}

const DEFAULT_TIME_SLOTS = [
  "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM",
  "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM"
];

function CalendarScheduler({
  timeSlots = DEFAULT_TIME_SLOTS,
  selectedDate,
  selectedTime,
  onConfirm,
  onSelect,
}: CalendarSchedulerProps) {
  const [date, setDate] = React.useState<Date | undefined>(selectedDate || new Date());
  const [time, setTime] = React.useState<string | undefined>(selectedTime);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onSelect?.({ date: newDate, time });
  };

  const handleTimeSelect = (newTime: string) => {
    setTime(newTime);
    onSelect?.({ date, time: newTime });
  };

  return (
    <div className="w-full max-w-[700px]">
      <Card className="shadow-none border-none bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-serif">Select Date & Time</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">
          {/* Calendar Section */}
          <div className="flex-1 border border-border/50 rounded-xl p-4 bg-background/30">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md"
            />
          </div>

          {/* Time Slots Section */}
          <div className="flex-1 border border-border/50 rounded-xl p-4 bg-background/30 overflow-y-auto max-h-[350px]">
            <p className="mb-4 text-sm font-medium text-muted-foreground/70 uppercase tracking-widest">
              Available Slots
            </p>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={time === slot ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "w-full h-10 transition-all duration-300",
                    time === slot && "ring-2 ring-primary/20 shadow-lg"
                  )}
                  onClick={() => handleTimeSelect(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-6 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => {
              setDate(undefined);
              setTime(undefined);
              onSelect?.({ date: undefined, time: undefined });
            }}
          >
            Reset Selection
          </Button>
          <Button
            size="lg"
            className="px-8 shadow-xl shadow-primary/20"
            onClick={() => onConfirm?.({ date, time })}
            disabled={!date || !time}
          >
            Confirm Appointment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export { CalendarScheduler };
