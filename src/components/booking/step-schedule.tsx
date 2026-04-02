'use client'

import { useState, useEffect } from 'react'
import { format, addDays, startOfDay, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import type { BookingFormData, Stylist } from '@/types'

interface Props {
  formData: BookingFormData
  updateForm: (updates: Partial<BookingFormData>) => void
  onNext: () => void
  onBack: () => void
}

// Generate 30-minute slots from 9:30 AM to 7:00 PM
function generateSlots(): string[] {
  const slots: string[] = []
  let hour = 9
  let minute = 30
  while (hour < 19 || (hour === 19 && minute === 0)) {
    slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
    minute += 30
    if (minute >= 60) {
      minute = 0
      hour++
    }
  }
  return slots
}

const ALL_SLOTS = generateSlots()

function formatSlot(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 || 12
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`
}

function getSelectableDates() {
  const dates = []
  const today = startOfDay(new Date())
  for (let i = 0; i < 30; i++) {
    const date = addDays(today, i)
    dates.push(date)
  }
  return dates
}

export function StepSchedule({ formData, updateForm, onNext, onBack }: Props) {
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const dates = getSelectableDates()
  const supabase = createClient()

  // Check availability
  useEffect(() => {
    if (!formData.booking_date) return
    setLoadingSlots(true)
    
    // In the new schema, staff mapping is not yet natively supported on the reservation table, 
    // so we calculate global availability based on existing reservations.
    supabase.from('reservation').select('start_time')
      .eq('reservation_date', formData.booking_date)
      .not('status', 'in', '("cancelled")')
      .then(({ data }) => {
        const records = data ?? []
        // Extract HH:MM out of the TIMESTAMPTZ start_time string
        const times = records.map(r => {
          const d = new Date(r.start_time);
          return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        })
        
        // Count overlapping reservations to prevent double bookings
        // Assume the salon has 2 available chairs globally for now since staff isn't mapped
        const MAX_CHAIRS = 2;
        const counts: Record<string, number> = {}
        times.forEach(time => {
          counts[time] = (counts[time] || 0) + 1
        })
        
        const fullyBooked = Object.keys(counts).filter(time => counts[time] >= MAX_CHAIRS)
        setBookedSlots(fullyBooked)
        
        if (formData.booking_time && fullyBooked.includes(formData.booking_time)) {
          updateForm({ booking_time: '' })
        }
        setLoadingSlots(false)
      })
  }, [formData.booking_date])

  const selectedDate = formData.booking_date ? parseISO(formData.booking_date) : null
  const canContinue = !!formData.booking_date && !!formData.booking_time

  return (
    <div className="space-y-7">
      {/* Date picker strip */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Select Date</Label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {dates.map((date) => {
            const iso = format(date, 'yyyy-MM-dd')
            const isSelected = formData.booking_date === iso
            const isSunday = date.getDay() === 0
            const dayLabel = format(date, 'EEE')
            const dateLabel = format(date, 'd')
            const monthLabel = format(date, 'MMM')

            return (
              <button
                key={iso}
                onClick={() => updateForm({ booking_date: iso, booking_time: '' })}
                disabled={isSunday && false}
                className={`flex-none w-16 rounded-xl py-3 text-center transition-all duration-150 border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isSelected
                    ? 'gradient-brand text-white border-transparent shadow-md'
                    : 'bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
                aria-pressed={isSelected}
                id={`date-${iso}`}
              >
                <p className="text-xs font-medium">{dayLabel}</p>
                <p className={`text-lg font-bold leading-tight ${isSelected ? '' : 'text-foreground'}`}>
                  {dateLabel}
                </p>
                <p className="text-xs opacity-70">{monthLabel}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slot grid */}
      {formData.booking_date && (
        <div>
          <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Select Time Slot
          </Label>
          {loadingSlots ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {ALL_SLOTS.map((slot) => {
                const isBooked = bookedSlots.includes(slot)
                const isSelected = formData.booking_time === slot
                return (
                  <button
                    key={slot}
                    onClick={() => !isBooked && updateForm({ booking_time: slot })}
                    disabled={isBooked}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all duration-150 text-center ${
                      isBooked
                        ? 'bg-muted border-border text-muted-foreground/40 cursor-not-allowed line-through'
                        : isSelected
                        ? 'gradient-brand text-white border-transparent shadow-sm'
                        : 'bg-card border-border text-foreground hover:border-primary/50 hover:bg-primary/5'
                    }`}
                    aria-label={`${formatSlot(slot)}${isBooked ? ' - Unavailable' : ''}`}
                    id={`slot-${slot}`}
                  >
                    {formatSlot(slot)}
                  </button>
                )
              })}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            Salon hours: 9:30 AM – 7:00 PM · Crossed-out slots are already booked
          </p>
        </div>
      )}

      {/* Summary */}
      {canContinue && formData.service && (
        <div className="bg-muted/50 rounded-xl px-5 py-4 text-sm space-y-1">
          <p className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2">Booking Summary</p>
          <p><span className="text-muted-foreground">Service:</span> {formData.service.service_name}</p>
          <p><span className="text-muted-foreground">Date:</span> {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : ''}</p>
          <p><span className="text-muted-foreground">Time:</span> {formatSlot(formData.booking_time)}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-none">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 gradient-brand text-white border-0 shadow-sm shadow-primary/30"
        >
          Continue
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
