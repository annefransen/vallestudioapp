import { createClient } from '@/lib/supabase/server'
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns'
import { AdminDashboard } from '@/components/admin/dashboard'

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
    supabase.from('walkins').select('walkin_id, status', { count: 'exact' }).eq('walkin_date', todayDate),
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
        guests (first_name, last_name),
        booking_items (*, services(service_name, category, price))
      `)
      .order('created_at', { ascending: false })
      .limit(10),
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
    
    const guestName = w.guests 
      ? `${w.guests.first_name} ${w.guests.last_name}`.trim()
      : 'Walk-in Guest'

    const service = w.booking_items?.[0]?.services

    return {
      id: w.walkin_id,
      status: w.status,
      guest_name: guestName,
      is_walkin: true,
      booking_date: w.walkin_date,
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
  const stats = await getDashboardStats()
  return <AdminDashboard stats={stats} />
}
