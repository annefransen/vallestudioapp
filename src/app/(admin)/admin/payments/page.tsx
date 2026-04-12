'use client'

import { useEffect, useState, useCallback } from 'react'
import { format, parseISO } from 'date-fns'
import { CheckCircle2, Clock, Loader2, CreditCard, Banknote, Smartphone, Globe, RotateCcw, TrendingUp, DollarSign, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Payment, PaymentStatus, PaymentMethod } from '@/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type PaymentWithBooking = Payment & {
  booking: {
    guest_name: string | null
    guest_phone: string | null
    booking_date: string
    booking_time: string
    service: { name: string; price: number } | null
  } | null
}

const METHOD_CONFIG: Record<PaymentMethod, { label: string; icon: React.ElementType; color: string }> = {
  cash: { label: 'Cash', icon: Banknote, color: 'text-emerald-600 bg-emerald-50' },
  gcash_instore: { label: 'GCash (In-store)', icon: Smartphone, color: 'text-blue-600 bg-blue-50' },
  gcash_online: { label: 'GCash Online', icon: Globe, color: 'text-violet-600 bg-violet-50' },
}

function formatTime(time: string) {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentWithBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all')
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'walkin'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const supabase = createClient()

  const loadPayments = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase.from('payments').select(`
        *,
        reservation:reservation_id (
          reservation_date, start_time,
          profiles (first_name, last_name, phone),
          guests (first_name, last_name, contact_number),
          booking_items (services(service_name, price))
        ),
        walkins:walkin_id (
          reservation_date, start_time, full_name, contact_number,
          booking_items (services(service_name, price))
        )
      `).order('created_at', { ascending: false })

      if (statusFilter !== 'all') query = query.eq('status', statusFilter)

      const { data, error } = await query
      if (!error && data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const normalized = data.map((p: any) => {
          let guestName = '—', guestPhone = '—', date = '', time = '', serviceObj = null
          if (p.reservation) {
            const res = p.reservation
            guestName = res.profiles ? `${res.profiles.first_name || ''} ${res.profiles.last_name || ''}`.trim() : res.guests ? `${res.guests.first_name || ''} ${res.guests.last_name || ''}`.trim() : 'Guest'
            guestPhone = res.guests?.contact_number || res.profiles?.phone || '—'
            date = res.reservation_date
            if (res.start_time) {
              const d = new Date(res.start_time)
              time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
            }
            const s = res.booking_items?.[0]?.services
            if (s) serviceObj = { name: s.service_name, price: s.price }
          } else if (p.walkins) {
            const w = p.walkins
            guestName = w.full_name || 'Walk-in'
            guestPhone = w.contact_number || '—'
            date = w.reservation_date
            if (w.start_time) {
              const d = new Date(w.start_time)
              time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
            }
            const s = w.booking_items?.[0]?.services
            if (s) serviceObj = { name: s.service_name, price: s.price }
          }
          return {
            id: p.payment_id,
            method: p.payment_method,
            status: p.status,
            amount: p.amount,
            created_at: p.created_at,
            paid_at: p.paid_at,
            _isWalkin: !!p.walkins,
            booking: { guest_name: guestName, guest_phone: guestPhone, booking_date: date, booking_time: time, service: serviceObj },
          }
        })
        setPayments(normalized as PaymentWithBooking[])
      }
    } finally {
      setLoading(false)
    }
  }, [statusFilter, supabase])

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  const markAsPaid = async (paymentId: string) => {
    setUpdatingId(paymentId)
    const { error } = await supabase.from('payments').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('payment_id', paymentId)
    if (error) { toast.error('Failed to update payment') } 
    else {
      toast.success('Payment marked as paid!')
      setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'paid' } : p))
    }
    setUpdatingId(null)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filtered = payments.filter((p: any) => {
    if (activeTab === 'online' && p._isWalkin) return false
    if (activeTab === 'walkin' && !p._isWalkin) return false
    return true
  })

  const sumPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0)
  const sumPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onlineRevenue = payments.filter((p: any) => !p._isWalkin && p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const walkinRevenue = payments.filter((p: any) => p._isWalkin && p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0)

  const statCards = [
    { label: 'Total Collected', value: `₱${sumPaid.toLocaleString('en-PH')}`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Pending', value: `₱${sumPending.toLocaleString('en-PH')}`, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Online Revenue', value: `₱${onlineRevenue.toLocaleString('en-PH')}`, icon: Globe, color: 'text-blue-600 bg-blue-50' },
    { label: 'Walk-in Revenue', value: `₱${walkinRevenue.toLocaleString('en-PH')}`, icon: DollarSign, color: 'text-violet-600 bg-violet-50' },
  ]

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Payments</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Track and manage all transactions</p>
        </div>
        <button onClick={loadPayments} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 bg-white rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-zinc-100 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-400">{s.label}</p>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', s.color)}>
                <s.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-zinc-900 mt-2 tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Main table card */}
      <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
        {/* Tabs + filter */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-1">
          <div className="flex">
            {(['all', 'online', 'walkin'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn('px-5 py-3.5 text-sm font-medium border-b-2 -mb-px transition-colors capitalize',
                  activeTab === tab ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-700'
                )}
              >
                {tab === 'all' ? 'All' : tab === 'online' ? 'Online' : 'Walk-in'}
              </button>
            ))}
          </div>
          <div className="pr-4">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as 'all' | PaymentStatus)}
              className="text-sm bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 outline-none focus:border-zinc-400 text-zinc-700"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm text-zinc-400">No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-zinc-50/80">
                  {['Client', 'Service', 'Amount', 'Method', 'Date', 'Status', ''].map(h => (
                    <th key={h} className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filtered.map(payment => {
                  const method = METHOD_CONFIG[payment.method as PaymentMethod]
                  const MethodIcon = method?.icon || CreditCard
                  const isUpdating = updatingId === payment.id
                  return (
                    <tr key={payment.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-[13px] font-medium text-zinc-900">{payment.booking?.guest_name || '—'}</p>
                        <p className="text-[11px] text-zinc-400">{payment.booking?.guest_phone || '—'}</p>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-zinc-600">{payment.booking?.service?.name || '—'}</td>
                      <td className="px-5 py-3.5 text-[13px] font-semibold text-zinc-900">₱{Number(payment.amount).toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        {method ? (
                          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium', method.color)}>
                            <MethodIcon className="w-3 h-3" /> {method.label}
                          </span>
                        ) : <span className="text-zinc-400 text-[13px]">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-zinc-500">
                        {payment.booking?.booking_date ? format(parseISO(payment.booking.booking_date), 'MMM d, yy') : '—'}
                        {payment.booking?.booking_time && <span className="block">{formatTime(payment.booking.booking_time)}</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        {payment.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <CheckCircle2 className="w-3 h-3" /> Paid
                          </span>
                        ) : payment.status === 'failed' ? (
                          <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-medium bg-red-50 text-red-600 border border-red-100">Failed</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {payment.status === 'pending' && (
                          <button
                            onClick={() => markAsPaid(payment.id)}
                            disabled={isUpdating}
                            className="text-[11px] font-semibold px-3 py-1.5 rounded-md bg-zinc-900 text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
                          >
                            {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin inline" /> : 'Mark Paid'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-zinc-50 bg-zinc-50/30">
              <span className="text-[11px] text-zinc-400">Showing {filtered.length} transactions</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
