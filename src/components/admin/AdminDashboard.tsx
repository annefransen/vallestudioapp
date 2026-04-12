'use client'

import { format } from 'date-fns'
import { Calendar, CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react'
import type { Booking } from '@/types'
import { cn } from '@/lib/utils'

interface Stats {
  todayBookings: number
  pendingPayments: number
  walkInsToday: number
  completedToday: number
  cancelledToday: number
  weeklyRevenue: number
  recentBookings: Booking[]
  activeStylists?: number
}

function formatTime(time: string) {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100',
  }[status] ?? 'bg-zinc-100 text-zinc-600 border-zinc-200'

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border', styles)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export function AdminDashboard({ stats }: { stats: Stats }) {
  const nextAppointment = stats.recentBookings.find(b => b.status === 'confirmed' || b.status === 'pending')

  const kpis = [
    {
      label: 'Booked Today',
      value: stats.todayBookings,
      icon: Calendar,
      accent: 'bg-blue-50 text-blue-600',
      trend: 'All reservations',
    },
    {
      label: 'Completed Today',
      value: stats.completedToday,
      icon: CheckCircle2,
      accent: 'bg-emerald-50 text-emerald-600',
      trend: 'Successfully served',
    },
    {
      label: 'Cancelled Today',
      value: stats.cancelledToday,
      icon: XCircle,
      accent: 'bg-red-50 text-red-500',
      trend: 'Across all types',
    },
    {
      label: "Today's Sales",
      value: `₱${stats.weeklyRevenue.toLocaleString('en-PH')}`,
      icon: TrendingUp,
      accent: 'bg-violet-50 text-violet-600',
      trend: 'Weekly revenue',
    },
  ]

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-0.5">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl border border-zinc-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-400 tracking-wide">{kpi.label}</p>
                <p className="text-2xl font-bold text-zinc-900 mt-2 tracking-tight">{kpi.value}</p>
                <p className="text-[11px] text-zinc-400 mt-1.5">{kpi.trend}</p>
              </div>
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', kpi.accent)}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next Appointment Highlight */}
      {nextAppointment && (
        <div className="bg-zinc-900 text-white rounded-xl p-5 flex items-center justify-between gap-4 shadow-xl shadow-zinc-200/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-widest">Next Appointment</p>
              <p className="text-base font-semibold text-white mt-0.5">
                {nextAppointment.guest_name ?? 'Guest'}
              </p>
              <p className="text-sm text-zinc-400 mt-0.5">
                {nextAppointment.service?.name ?? 'Service'} · {formatTime(nextAppointment.booking_time)}
              </p>
            </div>
          </div>
          <StatusBadge status={nextAppointment.status} />
        </div>
      )}

      {/* Recent Reservations */}
      <div className="bg-white rounded-xl border border-zinc-100 flex flex-col overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-zinc-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Recent Bookings</h2>
          <span className="text-[11px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md font-medium">
            {stats.recentBookings.length} today
          </span>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-50 max-h-[500px] no-scrollbar">
          {stats.recentBookings.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-zinc-400">
              No bookings today
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-50">
              {stats.recentBookings.map((booking) => (
                <div key={booking.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-zinc-600">
                        {(booking.guest_name?.[0] ?? 'G').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-zinc-900 leading-none">
                        {booking.guest_name ?? 'Guest'}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5 truncate max-w-[150px]">
                        {booking.service?.name ?? 'Service'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] font-semibold text-zinc-900">{formatTime(booking.booking_time)}</p>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
