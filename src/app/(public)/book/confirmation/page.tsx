'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, Calendar, Clock, Scissors, ArrowRight, Home } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import type { Booking } from '@/types'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('id')
  const paid = searchParams.get('paid') === '1'
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!bookingId) { setLoading(false); return }
    const supabase = createClient()
    supabase
      .from('reservation')
      .select(`
        *,
        profiles (*),
        guests (*),
        booking_items (*, services(*)),
        payments (*)
      `)
      .eq('reservation_id', bookingId)
      .single()
      .then(({ data, error }) => {
        if (data && !error) {
          const res = data as any
          const guestName = res.profiles 
            ? `${res.profiles.first_name || ''} ${res.profiles.last_name || ''}`.trim() 
            : res.guests 
              ? `${res.guests.first_name || ''} ${res.guests.last_name || ''}`.trim()
              : 'Guest'
          
          const guestPhone = res.guests?.phone || res.profiles?.phone || ''
          const service = res.booking_items?.[0]?.services
          const payment = res.payments?.[0]
          
          const d = new Date(res.start_time)
          const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

          const normalized: Booking = {
            id: res.reservation_id,
            profile_id: res.profile_id,
            guest_name: guestName,
            guest_phone: guestPhone,
            guest_email: res.guests?.email || res.profiles?.gmail || '',
            service_id: res.booking_items?.[0]?.service_id || '',
            stylist_name: res.stylist_id ? 'Stylist' : null, // placeholder or fetch name
            stylist_id: res.stylist_id,
            booking_date: res.reservation_date,
            booking_time: timeStr,
            status: res.status,
            notes: res.notes,
            is_walkin: false,
            promotion_id: null,
            created_at: res.created_at,
            updated_at: res.updated_at,
            service: service ? {
              service_id: service.service_id,
              service_name: service.service_name,
              name: service.service_name, // for compatibility
              category: service.category,
              price: service.price,
              price_type: service.price_type,
              duration: service.duration,
              status: service.status,
              created_at: service.created_at,
              updated_at: service.updated_at
            } as any : undefined,
            payment: payment ? {
              id: payment.payment_id,
              method: payment.payment_method,
              amount: payment.amount,
              status: payment.status,
              paid_at: payment.paid_at
            } as any : undefined
          }
          setBooking(normalized)
        }
        setLoading(false)
      })
  }, [bookingId])

  function formatTime(time: string) {
    const [h, m] = time.split(':').map(Number)
    const period = h >= 12 ? 'PM' : 'AM'
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-linear-to-br from-muted/40 to-background">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full gradient-brand flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-3xl font-heading font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            {paid
              ? 'Your payment was received. We look forward to seeing you!'
              : 'Your appointment is reserved. Payment is due at the salon.'}
          </p>

          {!loading && booking ? (
            <Card className="border-border/50 shadow-lg text-left mb-6">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                    <Scissors className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold">{booking.service?.name}</p>
                    <Badge variant="secondary" className={`text-xs category-${booking.service?.category}`}>
                      {booking.service?.category}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3 text-sm pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" /> Date
                  </div>
                  <div className="font-medium text-right">
                    {format(parseISO(booking.booking_date), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" /> Time
                  </div>
                  <div className="font-medium text-right">
                    {formatTime(booking.booking_time)}
                  </div>
                  {booking.stylist_name && (
                    <>
                      <div className="text-muted-foreground">Stylist</div>
                      <div className="font-medium text-right">{booking.stylist_name}</div>
                    </>
                  )}
                  <div className="text-muted-foreground">Client</div>
                  <div className="font-medium text-right">{booking.guest_name}</div>
                  <div className="text-muted-foreground">Payment</div>
                  <div className="font-medium text-right capitalize">
                    {booking.payment?.method?.replace(/_/g, ' ')}{' '}
                    <span className={paid || booking.payment?.status === 'paid' ? 'text-green-600' : 'text-amber-600'}>
                      ({paid || booking.payment?.status === 'paid' ? 'Paid' : 'Pending'})
                    </span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg px-4 py-3 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-0.5">Booking Reference</p>
                  <p className="font-mono text-xs">{booking.id.toUpperCase()}</p>
                </div>
              </CardContent>
            </Card>
          ) : loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className={buttonVariants({ variant: "outline", className: "flex-1" })}>
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            <Link href="/book" className={buttonVariants({ className: "flex-1 gradient-brand text-white border-0" })}>
                Book Again
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-muted/40 to-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
