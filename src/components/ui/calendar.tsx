"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(className)}
      classNames={{
        // Root wrapper — relative so nav can float over caption
        root: "relative",
        // Nav sits absolutely across the top of the calendar, overlaying the caption row
        nav: "absolute top-0 left-0 right-0 flex justify-between items-center h-9 px-1 pointer-events-none z-10",
        button_previous:
          "pointer-events-auto size-8 flex items-center justify-center rounded-md text-gray-400 hover:text-[#494136] hover:bg-[#494136]/8 transition-colors",
        button_next:
          "pointer-events-auto size-8 flex items-center justify-center rounded-md text-gray-400 hover:text-[#494136] hover:bg-[#494136]/8 transition-colors",
        // Layout
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-3",
        month_caption:
          "flex justify-center pt-1 pb-1 items-center w-full mb-1 h-9",
        caption_label: "text-base font-semibold tracking-wide text-[#1a1a1a]",
        // Grid
        month_grid: "w-full border-collapse",
        weekdays: "flex mb-1",
        weekday:
          "text-gray-400 font-medium text-[0.85rem] w-14 text-center select-none",
        weeks: "",
        week: "flex w-full",
        // Day cell (td wrapper)
        day: "relative p-0 text-center cursor-pointer",
        // Day button
        day_button:
          "size-14 p-0 text-base font-normal rounded-md inline-flex items-center justify-center transition-colors hover:bg-[#494136]/10  focus:outline-none cursor-pointer",
        // Modifier states — applied on top of day_button
        selected:
          "!bg-[#494136] !text-white focus:!bg-[#494136] focus:!text-white rounded-md font-semibold cursor-pointer",
        today:
          "bg-[#494136]/10 text-[#494136] font-bold rounded-md ring-1 ring-[#494136] cursor-pointer",
        outside: "text-gray-300 opacity-50",
        disabled:
          "text-gray-300 opacity-40 line-through cursor-not-allowed pointer-events-none",
        range_start: "!bg-[#494136] !text-white rounded-md",
        range_end: "!bg-[#494136] !text-white rounded-md",
        range_middle: "bg-[#494136]/10 text-[#494136]",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({
          orientation,
        }: {
          orientation?: "left" | "right" | "up" | "down";
        }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
