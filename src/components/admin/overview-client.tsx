'use client'

import { format, parseISO } from 'date-fns'
import { motion } from 'framer-motion'
import {
  Calendar, TrendingUp, Clock, UserCheck,
  CheckCircle2, XCircle, AlertCircle, Scissors
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Booking } from '@/types'

interface Stats {
  todayBookings: number
  pendingPayments: number
  walkInsToday: number
  completedToday: number
  cancelledToday: number
  weeklyRevenue: number
  recentBookings: Booking[]
}

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   icon: AlertCircle,  className: 'status-pending' },
  confirmed: { label: 'Confirmed', icon: CheckCircle2, className: 'status-confirmed' },
  completed: { label: 'Completed', icon: CheckCircle2, className: 'status-completed' },
  cancelled: { label: 'Cancelled', icon: XCircle,      className: 'status-cancelled' },
  no_show:   { label: 'No Show',   icon: XCircle,      className: 'status-no_show' },
}

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`
}

export function AdminOverviewClient({ stats }: { stats: Stats }) {
  const kpis = [
    {
      label: "Today's Bookings",
      value: stats.todayBookings,
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      sub: `${stats.completedToday} completed · ${stats.cancelledToday} cancelled`,
    },
    {
      label: 'Weekly Revenue',
      value: `₱${stats.weeklyRevenue.toLocaleString('en-PH')}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      sub: 'Paid invoices this week',
    },
    {
      label: 'Pending Payments',
      value: stats.pendingPayments,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      sub: 'Awaiting payment confirmation',
    },
    {
      label: "Walk-ins Today",
      value: stats.walkInsToday,
      icon: UserCheck,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      sub: 'Manually added by staff',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Dashboard for {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold mb-0.5">{kpi.value}</p>
                <p className="text-sm font-medium text-foreground">{kpi.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card className="border-border/50">
        <CardHeader className="px-6 py-5 border-b border-border">
          <h2 className="font-semibold">Recent Bookings</h2>
        </CardHeader>
        <div className="divide-y divide-border">
          {stats.recentBookings.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted-foreground text-sm">
              No bookings yet today.
            </div>
          ) : (
            stats.recentBookings.map((booking) => {
              const config = STATUS_CONFIG[booking.status]
              const StatusIcon = config.icon
              return (
                <div key={booking.id} className="px-6 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                  <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shrink-0">
                    <Scissors className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {booking.guest_name ?? booking.profile?.full_name ?? 'Guest'}
                      </p>
                      {booking.is_walkin && (
                        <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-600 border-purple-200">
                          Walk-in
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {booking.service?.name} · {format(parseISO(booking.booking_date), 'MMM d')} at {formatTime(booking.booking_time)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      ₱{booking.service?.price?.toLocaleString()}
                    </span>
                    <Badge variant="secondary" className={`text-xs ${config.className}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Card>
    </div>
  )
}
