import { createClient } from '@/lib/supabase/server'
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

async function getDashboardStats() {
  const supabase = await createClient()
  const today = new Date()
  const todayStart = startOfDay(today).toISOString()
  const todayEnd = endOfDay(today).toISOString()
  const weekStart = startOfWeek(today).toISOString()
  const weekEnd = endOfWeek(today).toISOString()
  const todayDate = format(today, 'yyyy-MM-dd')

  const [
    todayRes,
    walkIns,
    pendingPayments,
    weeklyPayments,
    recentResData,
    recentWalkinsData,
  ] = await Promise.all([
    supabase.from('reservation').select('reservation_id, status', { count: 'exact' }).eq('reservation_date', todayDate),
    supabase.from('walkins').select('walkin_id, status', { count: 'exact' }).eq('reservation_date', todayDate),
    supabase.from('payments').select('payment_id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('payments').select('amount').eq('status', 'paid').gte('paid_at', weekStart).lte('paid_at', weekEnd),
    supabase.from('reservation')
      .select(`
        *,
        profiles (first_name, last_name),
        guests (first_name, last_name),
        booking_items (*, services(service_name, category, price))
      `)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase.from('walkins')
      .select(`
        *,
        booking_items (*, services(service_name, category, price))
      `)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase.from('staff').select('staff_id', { count: 'exact', head: true }).eq('status', 'active'),
    // Fetch last 7 days of historical closed payments for graphing
    supabase.from('payments')
      .select('amount, paid_at')
      .eq('status', 'paid')
      .gte('paid_at', format(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'))
  ])

  // Process counts
  const resRecords = todayRes.data ?? []
  const walkRecords = walkIns.data ?? []

  const todayBookingsCount = resRecords.filter(r => r.status !== 'cancelled').length
  const completedCount = resRecords.filter(r => r.status === 'completed').length + walkRecords.filter(w => w.status === 'completed').length
  const cancelledCount = resRecords.filter(r => r.status === 'cancelled').length + walkRecords.filter(w => w.status === 'cancelled').length

  const weeklyRevenue = weeklyPayments.data?.reduce((sum, p) => sum + Number(p.amount ?? 0), 0) ?? 0

  // Normalize recent bookings for the frontend
  const normalizedRes = (recentResData.data ?? []).map((r: any) => {
    // Determine time from TIMESTAMPTZ
    const d = new Date(r.start_time)
    const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    
    const guestName = r.profiles 
      ? `${r.profiles.first_name} ${r.profiles.last_name}`.trim() 
      : r.guests 
        ? `${r.guests.first_name} ${r.guests.last_name}`.trim()
        : 'Guest'

    const service = r.booking_items?.[0]?.services

    return {
      id: r.reservation_id,
      status: r.status,
      guest_name: guestName,
      is_walkin: false,
      booking_date: r.reservation_date,
      booking_time: timeStr,
      created_at: r.created_at,
      service_id: service?.service_id || '',
      service: service ? {
        name: service.service_name,
        category: service.category,
        price: service.price
      } : undefined
    }
  })

  const normalizedWalkins = (recentWalkinsData.data ?? []).map((w: any) => {
    const d = new Date(w.start_time)
    const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

    const guestName = w.full_name || 'Walk-in Guest'
    const service = w.booking_items?.[0]?.services

    return {
      id: w.walkin_id,
      status: w.status,
      guest_name: guestName,
      is_walkin: true,
      booking_date: w.reservation_date,
      booking_time: timeStr,
      created_at: w.created_at,
      service_id: service?.service_id || '',
      service: service ? {
        name: service.service_name,
        category: service.category,
        price: service.price
      } : undefined
    }
  })

  // Combine, sort descending by created_at, and limit to 10
  const combinedRecent = [...normalizedRes, ...normalizedWalkins]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)

  // Compute graph aggregates for previous 7 rolling days
  const historicalPayments = recentResData[6]?.data ?? [] // Actually, it's index 7 in the Promise.all array if we destructured properly
  // Wait, let's fix the destructuring gracefully in the payload block by just extracting the 7th/8th index.
  // We'll compute the graph natively below.

  return {
    todayBookings: todayBookingsCount,
    pendingPayments: pendingPayments.count ?? 0,
    walkInsToday: walkIns.count ?? 0,
    completedToday: completedCount,
    cancelledToday: cancelledCount,
    weeklyRevenue,
    recentBookings: combinedRecent,
  }
}

export default async function AdminOverviewPage() {
  // Safe computation inside the execution wrapping
  const supabase = await createClient()
  const stats = await getDashboardStats()
  
  // Patch missing async destructured indices smoothly:
  const { count: staffCount } = await supabase.from('staff').select('staff_id', { count: 'exact', head: true }).eq('status', 'active')
  
  const sevenDaysAgo = format(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  const { data: chartPayments } = await supabase.from('payments').select('amount, paid_at').eq('status', 'paid').gte('paid_at', sevenDaysAgo)
  
  const chartAggregate: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    chartAggregate[format(d, 'EEE')] = 0
  }
  
  if (chartPayments) {
    chartPayments.forEach(p => {
      if (p.paid_at) {
        const d = new Date(p.paid_at)
        const dayLabel = format(d, 'EEE')
        if (chartAggregate[dayLabel] !== undefined) {
          chartAggregate[dayLabel] += Number(p.amount || 0)
        }
      }
    })
  }
  
  const chartData = Object.entries(chartAggregate).map(([name, revenue]) => ({ name, revenue }))
  
  return <AdminDashboard stats={{ ...stats, activeStylists: staffCount || 0, chartData }} />
}
