import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { createClient } from '@/lib/supabase/server'
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns'

async function getOwnerStats() {
  const supabase = await createClient()
  const today = new Date()
  const todayDate = format(today, 'yyyy-MM-dd')
  const weekStart = startOfWeek(today).toISOString()
  const weekEnd = endOfWeek(today).toISOString()

  // Fetch stats similar to Admin but could be expanded for Owner-specific KPIs
  const [
    bookingsRes,
    paymentsRes,
    recentResData,
  ] = await Promise.all([
    supabase.from('reservation').select('reservation_id, status').eq('reservation_date', todayDate),
    supabase.from('payments').select('amount').eq('status', 'paid').gte('paid_at', weekStart).lte('paid_at', weekEnd),
    supabase.from('reservation')
      .select(`
        *,
        profiles (first_name, last_name),
        booking_items (*, services(service_name, category, price))
      `)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const weeklyRevenue = paymentsRes.data?.reduce((sum, p) => sum + Number(p.amount ?? 0), 0) ?? 0
  const todayBookings = (bookingsRes.data ?? []).filter(r => r.status !== 'cancelled').length

  return {
    todayBookings,
    pendingPayments: 0, // Simplified for owner view
    walkInsToday: 0,
    completedToday: (bookingsRes.data ?? []).filter(r => r.status === 'completed').length,
    cancelledToday: (bookingsRes.data ?? []).filter(r => r.status === 'cancelled').length,
    weeklyRevenue,
    recentBookings: (recentResData.data ?? []).map((r: any) => ({
      id: r.reservation_id,
      status: r.status,
      guest_name: `${r.profiles?.first_name} ${r.profiles?.last_name}`,
      is_walkin: false,
      booking_date: r.reservation_date,
      booking_time: r.start_time,
      created_at: r.created_at,
      service: {
        name: r.booking_items?.[0]?.services?.service_name,
        price: r.booking_items?.[0]?.services?.price,
      }
    })),
  }
}

export default async function OwnerDashboardPage() {
  const stats = await getOwnerStats()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-heading font-bold text-[#1c120c]">Owner Dashboard</h1>
        <p className="text-muted-foreground">Strategic business overview for {format(new Date(), 'MMMM yyyy')}</p>
      </div>
      
      {/* Reusing AdminDashboard for now, but specialized for Owner */}
      <AdminDashboard stats={stats as any} />
    </div>
  )
}
