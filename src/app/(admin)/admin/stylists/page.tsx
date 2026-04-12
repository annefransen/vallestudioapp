'use client'

import { useState, useEffect } from 'react'
import { format, addDays, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight, Loader2, Users, Clock, Briefcase } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface Stylist {
  id: string
  name: string
  role: string
  active: boolean
}

interface Appointment {
  stylistId: string
  time: string
  durationSlots: number
  client: string
  service: string
  color: string
}

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM',
]

const APPT_COLORS = [
  'bg-rose-100 border-rose-200 text-rose-800',
  'bg-blue-100 border-blue-200 text-blue-800',
  'bg-amber-100 border-amber-200 text-amber-800',
  'bg-violet-100 border-violet-200 text-violet-800',
  'bg-emerald-100 border-emerald-200 text-emerald-800',
]

export default function StylistSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [schedules, setSchedules] = useState<Appointment[]>([])
  const [selectedStylistId, setSelectedStylistId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const supabase = createClient()
      const { data: staffData } = await supabase.from('staff').select('*').order('first_name')
      const mappedStylists = (staffData || []).map((s: Record<string, unknown>) => ({
        id: s.staff_id as string,
        name: `${s.first_name} ${s.last_name}`,
        role: s.role as string,
        active: s.status === 'active',
      }))
      setStylists(mappedStylists)
      if (mappedStylists.length > 0 && !selectedStylistId) {
        setSelectedStylistId(mappedStylists[0].id)
      }

      const targetDate = format(currentDate, 'yyyy-MM-dd')
      const [resData, walkData] = await Promise.all([
        supabase.from('reservation').select(`
          reservation_id, reservation_date, start_time, status, staff_id, stylist_id,
          profiles (first_name, last_name), guests (first_name, last_name),
          booking_items (*, services(service_name, duration))
        `).eq('reservation_date', targetDate),
        supabase.from('walkins').select(`
          walkin_id, reservation_date, start_time, status, staff_id, stylist_id, full_name,
          booking_items (*, services(service_name, duration))
        `).eq('reservation_date', targetDate),
      ])

      const mappedSchedules: Appointment[] = []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const processBooking = (r: any) => {
        const sId = r.staff_id || r.stylist_id
        if (!sId || r.status === 'cancelled') return
        const d = r.start_time ? new Date(r.start_time) : new Date()
        const timeStr = format(d, 'hh:mm a').toUpperCase()
        let clientName = r.full_name?.trim() || 'Walk-in'
        const p = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles
        const g = Array.isArray(r.guests) ? r.guests[0] : r.guests
        
        if (p || g) {
          clientName = p
            ? `${p.first_name} ${p.last_name}`.trim()
            : g ? `${g.first_name} ${g.last_name}`.trim() : 'Client'
        }
        const serviceGroup = r.booking_items?.[0]?.services
        const serviceName = serviceGroup?.service_name || 'Service'
        const durationStr = serviceGroup?.duration || '01:00:00'
        let durMin = 60
        if (typeof durationStr === 'string') {
          const parts = durationStr.split(':')
          durMin = (parseInt(parts[0]) * 60) + parseInt(parts[1] || '0')
        }
        mappedSchedules.push({
          stylistId: sId,
          time: timeStr,
          durationSlots: Math.max(1, Math.ceil(durMin / 30)),
          client: clientName,
          service: serviceName,
          color: APPT_COLORS[mappedSchedules.length % APPT_COLORS.length],
        })
      }
      ;(resData.data || []).forEach(processBooking)
      ;(walkData.data || []).forEach(processBooking)
      setSchedules(mappedSchedules)
      setLoading(false)
    }
    void loadData()
  }, [currentDate]) // eslint-disable-line react-hooks/exhaustive-deps

  const selectedStylist = stylists.find(s => s.id === selectedStylistId)
  const selectedAppts = schedules.filter(s => s.stylistId === selectedStylistId)
  const bookedSlots = new Set(selectedAppts.map(a => a.time))
  const availableCount = TIME_SLOTS.filter(t => !bookedSlots.has(t)).length

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Stylist Schedule</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Manage staff appointments and availability</p>
        </div>
        {/* Date Nav */}
        <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-lg p-1">
          <button onClick={() => setCurrentDate(subDays(currentDate, 1))} className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors">
            Today
          </button>
          <span className="px-3 text-sm font-semibold text-zinc-900 min-w-[110px] text-center">
            {format(currentDate, 'MMM d, yyyy')}
          </span>
          <button onClick={() => setCurrentDate(addDays(currentDate, 1))} className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[600px]">
          {/* Left: Stylist List */}
          <div className="bg-white rounded-xl border border-zinc-100 flex flex-col">
            <div className="px-5 py-4 border-b border-zinc-100">
              <h2 className="text-sm font-semibold text-zinc-900">Stylists</h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">{stylists.filter(s => s.active).length} active today</p>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-50">
              {stylists.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-sm text-zinc-400">No staff found</div>
              ) : stylists.map(stylist => {
                const apptCount = schedules.filter(s => s.stylistId === stylist.id).length
                const avail = TIME_SLOTS.length - apptCount
                const isSelected = selectedStylistId === stylist.id
                return (
                  <button
                    key={stylist.id}
                    onClick={() => setSelectedStylistId(stylist.id)}
                    className={cn(
                      'w-full px-5 py-4 flex items-center gap-3 text-left transition-colors',
                      isSelected ? 'bg-zinc-50' : 'hover:bg-zinc-50/50'
                    )}
                  >
                    <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2 transition-colors',
                      isSelected ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-100 text-zinc-600 border-transparent'
                    )}>
                      {stylist.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-zinc-900 truncate">{stylist.name}</p>
                      <p className="text-[11px] text-zinc-400 capitalize">{stylist.role}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Users className="w-3 h-3 text-zinc-400" />
                        <span className="text-zinc-900 font-semibold">{apptCount}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] mt-0.5">
                        <Clock className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-600 font-medium">{avail} free</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: Time Slot Grid */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-zinc-100 flex flex-col">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">
                  {selectedStylist ? selectedStylist.name : 'Select a stylist'}
                </h2>
                {selectedStylist && (
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {selectedAppts.length} booked · {availableCount} available slots
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-zinc-100 border border-zinc-200 inline-block" /> Available</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-zinc-900 inline-block" /> Booked</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-5">
              {!selectedStylistId ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-2">
                  <Briefcase className="w-8 h-8" />
                  <p className="text-sm">Select a stylist to view their schedule</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map(slot => {
                    const appt = selectedAppts.find(a => a.time === slot)
                    const isBooked = !!appt
                    return (
                      <div
                        key={slot}
                        className={cn(
                          'rounded-lg border p-3 text-left transition-all',
                          isBooked
                            ? cn('border', appt.color)
                            : 'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50 cursor-pointer'
                        )}
                      >
                        <p className={cn('text-[11px] font-bold', isBooked ? '' : 'text-zinc-500')}>{slot}</p>
                        {isBooked ? (
                          <div className="mt-1">
                            <p className="text-[12px] font-semibold truncate">{appt.client}</p>
                            <p className="text-[10px] truncate opacity-75">{appt.service}</p>
                          </div>
                        ) : (
                          <p className="text-[10px] text-zinc-400 mt-0.5">Available</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
