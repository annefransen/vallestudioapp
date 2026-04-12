'use client'

import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Search, Filter, Loader2, RotateCcw, Users, BookOpen, UserCheck, DollarSign } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Booking, BookingStatus } from '@/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`
}

function StatusBadge({ status }: { status: string }) {
  const s = {
    confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100',
  }[status] ?? 'bg-zinc-100 text-zinc-600 border-zinc-200'
  return (
    <span className={cn('inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium border', s)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default function ReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'online' | 'guest'>('online')
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const supabase = createClient()

  const loadBookings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('reservation')
      .select(`
        *,
        profiles (first_name, last_name, phone),
        guests (first_name, last_name, contact_number),
        booking_items (*, services(service_name, category, price)),
        payments (*)
      `)
      .order('reservation_date', { ascending: false })
      .order('start_time', { ascending: false })

    if (!error && data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalized = data.map((r: any) => {
        const d = new Date(r.start_time)
        const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
        const isGuest = !r.profiles
        const guestName = r.profiles
          ? `${r.profiles.first_name || ''} ${r.profiles.last_name || ''}`.trim()
          : r.guests
            ? `${r.guests.first_name || ''} ${r.guests.last_name || ''}`.trim()
            : 'Guest'
        const guestPhone = r.guests?.contact_number || r.profiles?.phone || ''
        const service = r.booking_items?.[0]?.services
        const payment = r.payments?.[0]
        return {
          id: r.reservation_id,
          status: r.status,
          guest_name: guestName,
          guest_phone: guestPhone,
          is_walkin: isGuest,
          booking_date: r.reservation_date,
          booking_time: timeStr,
          created_at: r.created_at,
          service: service ? { name: service.service_name, category: service.category, price: service.price } : null,
          payment: payment ? { method: payment.payment_method, status: payment.status, amount: payment.amount } : null,
        }
      })
      setBookings(normalized as Booking[])
    }
    setLoading(false)
  }

  useEffect(() => {
    void loadBookings()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (bookingId: string, newStatus: BookingStatus) => {
    setUpdatingId(bookingId)
    const { error } = await supabase.from('reservation').update({ status: newStatus }).eq('reservation_id', bookingId)
    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success(`Status updated to ${newStatus}`)
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b))
    }
    setUpdatingId(null)
  }

  const filtered = bookings.filter(b => {
    if (activeTab === 'online' && b.is_walkin) return false
    if (activeTab === 'guest' && !b.is_walkin) return false
    if (statusFilter !== 'all' && b.status !== statusFilter) return false
    const q = search.toLowerCase()
    return (
      (b.guest_name ?? '').toLowerCase().includes(q) ||
      (b.guest_phone ?? '').toLowerCase().includes(q) ||
      (b.service?.name ?? '').toLowerCase().includes(q)
    )
  })

  // Derived stats
  const totalRevenue = bookings.reduce((s, b) => s + (b.payment?.amount ?? 0), 0)
  const guestCount = bookings.filter(b => b.is_walkin).length
  const onlineCount = bookings.filter(b => !b.is_walkin).length

  const statCards = [
    { label: 'Total Reservations', value: bookings.length, icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
    { label: 'Online Clients', value: onlineCount, icon: UserCheck, color: 'text-violet-600 bg-violet-50' },
    { label: 'Guest Bookings', value: guestCount, icon: Users, color: 'text-amber-600 bg-amber-50' },
    { label: 'Total Revenue', value: `₱${totalRevenue.toLocaleString('en-PH')}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
  ]

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Reservations</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Manage all client and guest bookings</p>
        </div>
        <button
          onClick={loadBookings}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 bg-white rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-zinc-100 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-400">{s.label}</p>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', s.color)}>
                <s.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-900 mt-2 tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-zinc-100">
          {(['online', 'guest'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                activeTab === tab
                  ? 'border-zinc-900 text-zinc-900'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700'
              )}
            >
              {tab === 'online' ? `Online Bookings (${onlineCount})` : `Guest / Walk-in (${guestCount})`}
            </button>
          ))}
        </div>

        {/* Search + Filter row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              placeholder="Search name, phone, service…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-zinc-400 focus:bg-white transition-colors placeholder:text-zinc-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | BookingStatus)}
            className="px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-zinc-400 text-zinc-700 appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-zinc-50/80">
                  <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Service</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Payment</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center text-sm text-zinc-400">
                      No reservations found.
                    </td>
                  </tr>
                ) : (
                  filtered.map(booking => {
                    const isUpdating = updatingId === booking.id
                    return (
                      <tr key={booking.id} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                              <span className="text-[11px] font-bold text-zinc-500">
                                {(booking.guest_name?.[0] ?? 'G').toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-zinc-900 text-[13px]">{booking.guest_name}</p>
                              <p className="text-[11px] text-zinc-400 mt-0.5">{booking.guest_phone || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-zinc-900 text-[13px]">{booking.service?.name || 'N/A'}</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">₱{(booking.service?.price ?? 0).toLocaleString()}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-[13px] font-medium text-zinc-900">{format(parseISO(booking.booking_date), 'MMM d, yyyy')}</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{formatTime(booking.booking_time)}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-5 py-3.5">
                          {booking.payment ? (
                            <div>
                              <p className="text-[13px] font-medium text-zinc-900">₱{booking.payment.amount?.toLocaleString()}</p>
                              <p className="text-[11px] text-zinc-400 capitalize">{booking.payment.method?.replace(/_/g, ' ')}</p>
                            </div>
                          ) : (
                            <span className="text-[11px] text-zinc-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => updateStatus(booking.id, 'confirmed')}
                                disabled={isUpdating}
                                className="px-2.5 py-1.5 text-[11px] font-semibold text-white bg-zinc-900 hover:bg-zinc-700 rounded-md transition-colors disabled:opacity-50"
                              >
                                Approve
                              </button>
                            )}
                            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                              <button
                                onClick={() => updateStatus(booking.id, 'cancelled')}
                                disabled={isUpdating}
                                className="px-2.5 py-1.5 text-[11px] font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-zinc-50 bg-zinc-50/30">
              <span className="text-[11px] text-zinc-400">Showing {filtered.length} of {bookings.length} reservations</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
