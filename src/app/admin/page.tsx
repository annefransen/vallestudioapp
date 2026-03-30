import { createClient } from '@/lib/supabase/server'
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns'
import { AdminOverviewClient } from '@/components/admin/overview-client'

async function getDashboardStats() {
  const supabase = await createClient()
  const today = new Date()
  const todayStart = startOfDay(today).toISOString()
  const todayEnd = endOfDay(today).toISOString()
  const weekStart = startOfWeek(today).toISOString()
  const weekEnd = endOfWeek(today).toISOString()
  const todayDate = format(today, 'yyyy-MM-dd')

  const [
    todayBookings,
    pendingPayments,
    walkIns,
    completedToday,
    cancelledToday,
    weeklyPayments,
    recentBookings,
  ] = await Promise.all([
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('booking_date', todayDate).not('status', 'in', '("cancelled","no_show")'),
    supabase.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('booking_date', todayDate).eq('is_walkin', true),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('booking_date', todayDate).eq('status', 'completed'),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('booking_date', todayDate).eq('status', 'cancelled'),
    supabase.from('payments').select('amount').eq('status', 'paid').gte('paid_at', weekStart).lte('paid_at', weekEnd),
    supabase.from('bookings')
      .select('*, service:services(name, category, price), payment:payments(*)')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const weeklyRevenue = weeklyPayments.data?.reduce((sum, p) => sum + (p.amount ?? 0), 0) ?? 0

  return {
    todayBookings: todayBookings.count ?? 0,
    pendingPayments: pendingPayments.count ?? 0,
    walkInsToday: walkIns.count ?? 0,
    completedToday: completedToday.count ?? 0,
    cancelledToday: cancelledToday.count ?? 0,
    weeklyRevenue,
    recentBookings: recentBookings.data ?? [],
  }
}

export default async function AdminOverviewPage() {
  const stats = await getDashboardStats()
  return <AdminOverviewClient stats={stats} />
}
