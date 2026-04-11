'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { ChevronLeft, Loader2, Banknote, Smartphone, Globe, CheckCircle2, Calendar, Clock, Scissors } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Separator } from '@/components/ui/Separator'
import { createClient } from '@/lib/supabase/client'
import type { BookingFormData, PaymentMethod } from '@/types'
import { toast } from 'sonner'

interface Props {
  formData: BookingFormData
  updateForm: (updates: Partial<BookingFormData>) => void
  onBack: () => void
}

const PAYMENT_METHODS: {
  id: PaymentMethod
  label: string
  description: string
  icon: React.ElementType
  badge?: string
}[] = [
  {
    id: 'cash',
    label: 'Cash',
    description: 'Pay when you arrive at the salon',
    icon: Banknote,
  },
  {
    id: 'gcash_instore',
    label: 'GCash (In-store)',
    description: 'Scan the QR code at the salon counter',
    icon: Smartphone,
  },
  {
    id: 'gcash_online',
    label: 'GCash Online',
    description: 'Pay now securely via GCash — powered by Xendit',
    icon: Globe,
    badge: 'Recommended',
  },
]

function formatPrice(price: number) {
  return `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 0 })}`
}

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`
}

export function StepPayment({ formData, updateForm, onBack }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const basePrice = formData.service?.price ?? 0
  const total = basePrice

  const handleBook = async () => {
    setLoading(true)

    try {
      // Get current user (may be null for guests)
      const { data: { user } } = await supabase.auth.getUser()

      // Create booking via API route
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: user?.id ?? null,
          guest_name: formData.guest_name,
          guest_phone: formData.guest_phone,
          guest_email: formData.guest_email || null,
          service_id: formData.service_id,
          booking_date: formData.booking_date,
          booking_time: formData.booking_time,
          notes: formData.notes || null,
          payment_method: formData.payment_method,
          amount: total,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error ?? 'Failed to create booking')
      }

      // If online GCash - redirect to Xendit payment URL
      if (formData.payment_method === 'gcash_online' && result.paymentUrl) {
        window.location.href = result.paymentUrl
        return
      }

      toast.success('Booking confirmed! See you at Valle Studio. 🎉')
      router.push(`/book/confirmation?id=${result.bookingId}`)

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Booking summary card */}
      <div className="bg-muted/40 border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Booking Summary</h2>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">{formData.service?.service_name}</p>
              <Badge variant="secondary" className={`text-xs category-${formData.service?.category}`}>
                {formData.service?.category}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              Date
            </div>
            <div className="font-medium text-right">
              {formData.booking_date
                ? format(parseISO(formData.booking_date), 'MMM d, yyyy')
                : '—'}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              Time
            </div>
            <div className="font-medium text-right">
              {formData.booking_time ? formatTime(formData.booking_time) : '—'}
            </div>

            <div className="text-muted-foreground">Client</div>
            <div className="font-medium text-right">{formData.guest_name}</div>
            <div className="text-muted-foreground">Phone</div>
            <div className="font-medium text-right">{formData.guest_phone}</div>
          </div>

          <Separator />

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between font-bold text-base pt-1">
              <span>Total Amount</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment method */}
      <div className="space-y-3">
        <h2 className="font-semibold text-sm">Select Payment Method</h2>
        {PAYMENT_METHODS.map((method) => {
          const isSelected = formData.payment_method === method.id
          return (
            <button
              key={method.id}
              onClick={() => updateForm({ payment_method: method.id })}
              className={`w-full text-left flex items-center gap-4 rounded-xl border-2 px-4 py-4 transition-all duration-150 focus:outline-none ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
              id={`payment-${method.id}`}
              aria-pressed={isSelected}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isSelected ? 'gradient-brand text-white' : 'bg-muted text-muted-foreground'
              }`}>
                <method.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{method.label}</span>
                  {method.badge && (
                    <Badge className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                      {method.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                isSelected ? 'border-primary bg-primary' : 'border-border'
              }`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          )
        })}
      </div>

      {formData.payment_method === 'gcash_online' && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          You'll be redirected to a secure GCash payment page. Your booking will be confirmed once payment is completed.
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-none" disabled={loading}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          onClick={handleBook}
          disabled={loading}
          className="flex-1 gradient-brand text-white border-0 shadow-md shadow-primary/30 h-11 text-base"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing…</>
          ) : formData.payment_method === 'gcash_online' ? (
            <>Pay ₱{total.toLocaleString()} via GCash</>
          ) : (
            <>Confirm Booking</>
          )}
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground pb-4">
        By booking, you agree to our cancellation policy. Cancellations must be made at least 2 hours before your appointment.
      </p>
    </div>
  )
}
