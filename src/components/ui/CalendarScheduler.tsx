"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/Calendar";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
} from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export interface CalendarSchedulerProps {
  timeSlots?: string[];
  selectedDate?: Date;
  selectedTime?: string;
  onConfirm?: (value: { date?: Date; time?: string }) => void;
  onSelect?: (value: { date?: Date; time?: string }) => void;
  duration?: number;
}

const DEFAULT_TIME_SLOTS = [
  "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM",
  "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM"
];

// Mock locked slots for the demo
const MOCK_UNAVAILABLE_SLOTS = ["11:30 AM", "02:00 PM", "05:30 PM"];

function CalendarScheduler({
  timeSlots = DEFAULT_TIME_SLOTS,
  selectedDate,
  selectedTime,
  onSelect,
  duration = 0
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
    <div className="w-full max-w-[800px]">
      <Card className="shadow-none border-none bg-background/50 backdrop-blur-sm">
        <CardContent className="flex flex-col md:flex-row gap-8 p-0">
          {/* Calendar Section */}
          <div className="flex-1 rounded-3xl p-6 bg-white border border-border/40 shadow-xl shadow-black/5">
            <h3 className="text-xl font-serif mb-6 text-foreground">Date</h3>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="w-full pointer-events-auto"
                classNames={{
                  months: "w-full",
                  month: "w-full space-y-4",
                  caption: "flex justify-center pt-1 relative items-center mb-4",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex w-full justify-between mb-2",
                  head_cell: "text-muted-foreground w-9 font-normal text-[0.8rem] text-center",
                  row: "flex w-full mt-2 justify-between",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-muted first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-muted rounded-full transition-all",
                  day_selected: "bg-foreground text-background hover:bg-foreground hover:text-background focus:bg-foreground focus:text-background",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_hidden: "invisible",
                }}
              />
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="flex-1 rounded-3xl p-6 bg-white border border-border/40 shadow-xl shadow-black/5 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif text-foreground">Time</h3>
              {duration > 0 && (
                <span className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" /> {duration} mins allocated
                </span>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[320px] custom-scrollbar pr-2 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((slot) => {
                  const isSelected = time === slot;
                  const isAvailable = !MOCK_UNAVAILABLE_SLOTS.includes(slot);

                  return (
                    <Button
                      key={slot}
                      variant="outline"
                      size="sm"
                      disabled={!isAvailable || !date}
                      className={cn(
                        "w-full h-12 transition-all duration-300 rounded-xl text-sm font-medium pointer-events-auto",
                        !isAvailable && "opacity-40 border-dashed bg-muted/20 text-muted-foreground",
                        isAvailable && !isSelected && "hover:border-foreground/40 hover:bg-muted/10 border-border/60",
                        isSelected && "bg-foreground text-background border-foreground shadow-xl shadow-black/10 scale-[1.02]"
                      )}
                      onClick={() => handleTimeSelect(slot)}
                    >
                      {slot} {isSelected && <span className="ml-1 opacity-70">✔</span>}
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {/* Status Key */}
            <div className="mt-6 flex justify-center gap-4 border-t border-border/40 pt-4 pb-1">
               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full border border-border/60"></div><span className="text-[0.625rem] tracking-widest uppercase text-muted-foreground">Available</span></div>
               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-foreground"></div><span className="text-[0.625rem] tracking-widest uppercase text-muted-foreground">Selected</span></div>
               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full border border-dashed border-border/60"></div><span className="text-[0.625rem] tracking-widest uppercase text-muted-foreground">Unavailable</span></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { CalendarScheduler };
