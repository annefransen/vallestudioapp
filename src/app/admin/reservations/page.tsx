'use client'

import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import {
  Search, Filter, ChevronDown, CheckCircle2, XCircle,
  AlertCircle, Loader2, Scissors, Calendar, Clock, Phone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import type { Booking, BookingStatus } from '@/types'
import { toast } from 'sonner'

const STATUS_OPTIONS: { value: 'all' | BookingStatus; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No Show' },
]

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   className: 'status-pending', icon: AlertCircle },
  confirmed: { label: 'Confirmed', className: 'status-confirmed', icon: CheckCircle2 },
  completed: { label: 'Completed', className: 'status-completed', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', className: 'status-cancelled', icon: XCircle },
  no_show:   { label: 'No Show',   className: 'status-no_show', icon: XCircle },
}

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`
}

export default function ReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const supabase = createClient()

  const loadBookings = async () => {
    let query = supabase
      .from('reservation')
      .select(`
        *,
        profiles (first_name, last_name, phone),
        guests (first_name, last_name, phone),
        booking_items (*, services(service_name, category, price)),
        payments (*)
      `)
      .order('reservation_date', { ascending: false })
      .order('start_time', { ascending: false })

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query
    if (!error && data) {
      const normalized = data.map((r: any) => {
        const d = new Date(r.start_time)
        const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

        const guestName = r.profiles 
          ? `${r.profiles.first_name || ''} ${r.profiles.last_name || ''}`.trim() 
          : r.guests 
            ? `${r.guests.first_name || ''} ${r.guests.last_name || ''}`.trim()
            : 'Guest'
            
        const guestPhone = r.guests?.phone || r.profiles?.phone || ''
        const service = r.booking_items?.[0]?.services
        const payment = r.payments?.[0]

        return {
          id: r.reservation_id,
          status: r.status,
          guest_name: guestName,
          guest_phone: guestPhone,
          is_walkin: false,
          booking_date: r.reservation_date,
          booking_time: timeStr,
          created_at: r.created_at,
          service: service ? {
            name: service.service_name,
            category: service.category,
            price: service.price
          } : null,
          payment: payment ? {
            method: payment.payment_method,
            status: payment.status,
            amount: payment.amount,
          } : null
        }
      })
      setBookings(normalized as any[])
    }
    setLoading(false)
  }

  useEffect(() => { loadBookings() }, [statusFilter])

  const updateStatus = async (bookingId: string, newStatus: BookingStatus) => {
    setUpdatingId(bookingId)
    const { error } = await supabase
      .from('reservation')
      .update({ status: newStatus })
      .eq('reservation_id', bookingId)

    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success(`Status updated to ${newStatus}`)
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b))
    }
    setUpdatingId(null)
  }

  const filtered = bookings.filter(b => {
    const name = (b.guest_name ?? b.profile?.full_name ?? '').toLowerCase()
    const phone = (b.guest_phone ?? '').toLowerCase()
    const service = (b.service?.name ?? '').toLowerCase()
    const q = search.toLowerCase()
    return name.includes(q) || phone.includes(q) || service.includes(q)
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[clamp(1.25rem,2vw+0.5rem,1.5rem)] font-heading font-bold">Reservations</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage all customer bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or service…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
            id="reservations-search"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | BookingStatus)}>
          <SelectTrigger className="w-full sm:w-44" id="status-filter">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/50 p-12 text-center text-muted-foreground">
          No reservations found
        </Card>
      ) : (
        <Card className="border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Service</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Date & Time</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Payment</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(booking => {
                  const config = STATUS_CONFIG[booking.status]
                  const StatusIcon = config.icon
                  const isUpdating = updatingId === booking.id
                  return (
                    <tr key={booking.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium">{booking.guest_name ?? booking.profile?.full_name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          {booking.guest_phone}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium">{booking.service?.name}</p>
                        <Badge variant="secondary" className={`text-xs mt-0.5 category-${booking.service?.category}`}>
                          {booking.service?.category}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {format(parseISO(booking.booking_date), 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatTime(booking.booking_time)}
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {booking.payment ? (
                          <div>
                            <p className="text-xs capitalize">
                              {booking.payment.method?.replace(/_/g, ' ') || 'Cash'}
                            </p>
                            <p className={`text-xs font-medium ${booking.payment.status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                              {booking.payment.status === 'paid' ? 'Paid' : 'Pending'} — ₱{(booking.payment.amount ?? 0).toLocaleString()}
                            </p>
                          </div>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="secondary" className={`text-xs ${config.className}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Select
                          value={booking.status}
                          onValueChange={(v) => updateStatus(booking.id, v as BookingStatus)}
                          disabled={isUpdating}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs" id={`status-${booking.id}`}>
                            {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <SelectValue />}
                            <ChevronDown className="w-3 h-3 ml-auto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="no_show">No Show</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
            Showing {filtered.length} of {bookings.length} reservations
          </div>
        </Card>
      )}
    </div>
  )
}
