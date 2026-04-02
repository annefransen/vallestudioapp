'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format, parseISO, isPast, isToday } from 'date-fns'
import { motion } from 'framer-motion'
import {
  Calendar, Clock, Scissors, ArrowRight, Plus,
  CheckCircle2, XCircle, AlertCircle, Loader2, User
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import type { Booking, Profile } from '@/types'
import { toast } from 'sonner'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',    icon: AlertCircle, className: 'status-pending' },
  confirmed: { label: 'Confirmed',  icon: CheckCircle2, className: 'status-confirmed' },
  completed: { label: 'Completed',  icon: CheckCircle2, className: 'status-completed' },
  cancelled: { label: 'Cancelled',  icon: XCircle, className: 'status-cancelled' },
  no_show:   { label: 'No Show',    icon: XCircle, className: 'status-no_show' },
}

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`
}

// We bypass the old Booking type to reflect the nested relational structure of the new 11-table schema.
type UnifiedReservation = any

function BookingCard({ booking, onCancel }: { booking: UnifiedReservation; onCancel: (id: string) => void }) {
  const status = booking.status
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
  const StatusIcon = config.icon
  const bookingDate = parseISO(booking.reservation_date || new Date().toISOString())
  const isUpcoming = !isPast(bookingDate) || isToday(bookingDate)
  const canCancel = (status === 'pending' || status === 'confirmed') && isUpcoming

  const mainService = booking.booking_items?.[0]?.services
  const paymentRecord = booking.payments?.[0]

  // Extract HH:MM out of TIMESTAMPTZ start_time
  let displayTime = '00:00'
  if (booking.start_time) {
    const d = new Date(booking.start_time)
    displayTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <Card className="border-border/50 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shrink-0">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">{mainService?.service_name || 'Salon Component'}</p>
              <Badge variant="secondary" className={`text-xs mt-0.5 category-${mainService?.category || 'hair'}`}>
                {mainService?.category || 'General'}
              </Badge>
            </div>
          </div>
          <Badge variant="secondary" className={`text-xs ${config.className} shrink-0`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            {format(bookingDate, 'MMM d, yyyy')}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {formatTime(displayTime)}
          </div>
        </div>

        {paymentRecord && (
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted-foreground uppercase tracking-wider font-medium text-[10px]">
              {paymentRecord.payment_method?.replace(/_/g, ' ')} Payment
            </span>
            <span className={paymentRecord.status === 'paid' || booking.payment_status === 'paid' ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
              {paymentRecord.status === 'paid' || booking.payment_status === 'paid' ? 'Paid' : 'Pending'} — ₱{(Number(paymentRecord.amount) || 0).toLocaleString()}
            </span>
          </div>
        )}

        {canCancel && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
            onClick={() => onCancel(booking.reservation_id)}
          >
            Cancel Appointment
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState<UnifiedReservation[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [bookingsRes, profileRes] = await Promise.all([
      supabase
        .from('reservation')
        .select('*, booking_items(*, services(*)), payments(*)')
        .eq('profile_id', user.id)
        .order('reservation_date', { ascending: false }),
      supabase.from('profiles').select('*').eq('profile_id', user.id).single(),
    ])

    setBookings(bookingsRes.data ?? [])
    setProfile(profileRes.data)
    setLoading(false)
  }

  const handleCancel = async (bookingId: string) => {
    const { error } = await supabase
      .from('reservation')
      .update({ status: 'cancelled' })
      .eq('reservation_id', bookingId)

    if (error) {
      toast.error('Failed to cancel booking')
      return
    }

    toast.success('Booking cancelled successfully')
    setBookings(prev =>
      prev.map(b => b.reservation_id === bookingId ? { ...b, status: 'cancelled' } : b)
    )
  }

  const upcoming = bookings.filter(b =>
    (b.status === 'pending' || b.status === 'confirmed') &&
    b.reservation_date && !isPast(parseISO(b.reservation_date))
  )
  const past = bookings.filter(b =>
    b.status === 'completed' || b.status === 'cancelled' ||
    b.status === 'no_show' || (b.reservation_date && isPast(parseISO(b.reservation_date)))
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-muted/30 to-background py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold">
                Welcome back, {profile?.first_name ?? 'there'}! 👋
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Manage your appointments below.</p>
            </div>
            <Link href="/book" className={buttonVariants({ className: "gradient-brand text-white border-0 hidden sm:flex" })}>
                <Plus className="w-4 h-4 mr-2" />
                New Booking
              </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Upcoming', value: upcoming.length, color: 'text-blue-600' },
            { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'text-green-600' },
            { label: 'Total', value: bookings.length, color: 'text-primary' },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile book button */}
        <Link href="/book" className={buttonVariants({ className: "w-full gradient-brand text-white border-0 mb-6 sm:hidden" })}>
            <Plus className="w-4 h-4 mr-2" />
            Book New Appointment
          </Link>

        {/* Tabs */}
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              Upcoming {upcoming.length > 0 && `(${upcoming.length})`}
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcoming.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold">No upcoming appointments</p>
                  <p className="text-sm text-muted-foreground">Ready for your next salon visit?</p>
                </div>
                <Link href="/book" className={buttonVariants({ className: "gradient-brand text-white border-0" })}>
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map((booking, i) => (
                  <motion.div
                    key={booking.reservation_id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <BookingCard booking={booking} onCancel={handleCancel} />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {past.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                No past appointments yet.
              </div>
            ) : (
              <div className="space-y-4">
                {past.map((booking, i) => (
                  <motion.div
                    key={booking.reservation_id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <BookingCard booking={booking} onCancel={handleCancel} />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
