'use client'

import { useEffect, useState } from 'react'
import { Plus, Loader2, CheckCircle2, Clock, User, Phone, CreditCard, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { format as formatDate } from 'date-fns'
import { cn } from '@/lib/utils'

const schema = z.object({
  guest_name: z.string().min(2, 'Name required'),
  guest_phone: z.string().min(7, 'Phone required'),
  service_id: z.string().min(1, 'Service required'),
  booking_date: z.string().min(1, 'Date required'),
  booking_time: z.string().min(1, 'Time required'),
  payment_method: z.enum(['cash', 'gcash_instore', 'gcash_online']),
  is_paid: z.boolean(),
})
type FormData = z.infer<typeof schema>

export type AdminWalkin = {
  id: string
  guest_name: string
  guest_phone: string
  booking_date: string
  booking_time: string
  status: string
  service: { name: string; category: string; price: number } | null
  payment: { id: string; method: string; status: string; amount: number } | null
}

const STATUS_COLUMNS = [
  { id: 'pending', label: 'Pending', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { id: 'confirmed', label: 'In Queue', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { id: 'processing', label: 'Processing', color: 'bg-violet-50 border-violet-200 text-violet-700' },
  { id: 'completed', label: 'Completed', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
]

export default function WalkInsPage() {
  const [walkIns, setWalkIns] = useState<AdminWalkin[]>([])
  const [services, setServices] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeView, setActiveView] = useState<'queue' | 'history'>('queue')
  const supabase = createClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      payment_method: 'cash',
      is_paid: false,
      booking_date: formatDate(new Date(), 'yyyy-MM-dd'),
    },
  })

  useEffect(() => { void loadData() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    const [wRes, sRes] = await Promise.all([
      supabase.from('walkins').select('*, booking_items(*, services(*)), payments(*)').order('created_at', { ascending: false }),
      supabase.from('services').select('*').in('status', ['available', 'active']).order('category'),
    ])
    const normalized = (wRes.data ?? []).map(w => {
      const d = w.start_time ? new Date(w.start_time) : new Date()
      const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      const service = w.booking_items?.[0]?.services
      const payment = w.payments?.[0]
      return {
        id: w.walkin_id,
        guest_name: w.full_name?.trim() || 'Walk-in Guest',
        guest_phone: w.contact_number || '',
        booking_date: w.reservation_date,
        booking_time: timeStr,
        status: w.status,
        service: service ? { name: service.service_name, category: service.category, price: service.price } : null,
        payment: payment ? { id: payment.payment_id, method: payment.payment_method, status: payment.status, amount: payment.amount } : null,
      }
    })
    setWalkIns(normalized as AdminWalkin[])
    setServices(sRes.data ?? [])
    setLoading(false)
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    const service = services.find(s => s.id === data.service_id || s.service_id === data.service_id)
    if (!service) { setSubmitting(false); return }
    try {
      const [firstName, ...lastNameParts] = data.guest_name.split(' ')
      const lastName = lastNameParts.join(' ') || 'Walk-in'
      const { data: guestData, error: guestErr } = await supabase.from('guests').insert({
        first_name: firstName, last_name: lastName, phone: data.guest_phone, role: 'walkin',
      }).select('guest_id').single()
      if (guestErr || !guestData) throw new Error('Failed to create guest')

      const startTimeISO = new Date(`${data.booking_date}T${data.booking_time}:00`).toISOString()
      const { data: walkinData, error: walkinErr } = await supabase.from('walkins').insert({
        guest_id: guestData.guest_id,
        reservation_date: data.booking_date,
        start_time: startTimeISO,
        status: 'pending',
        notes: 'Added via Admin Dashboard',
      }).select('walkin_id').single()
      if (walkinErr || !walkinData) throw new Error('Failed to create walk-in record')

      const svc = service as Record<string, unknown>
      await supabase.from('booking_items').insert({
        walkin_id: walkinData.walkin_id,
        item_type: 'service',
        service_id: svc.service_id || svc.id,
        price_at_time: svc.price,
        duration_at_time: svc.duration || '00:30:00',
      })
      await supabase.from('payments').insert({
        walkin_id: walkinData.walkin_id,
        payment_method: data.payment_method,
        amount: svc.price,
        status: data.is_paid ? 'paid' : 'pending',
        paid_at: data.is_paid ? new Date().toISOString() : null,
      })
      toast.success('Walk-in added!')
      reset()
      setOpen(false)
      void loadData()
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Transaction failed')
    } finally {
      setSubmitting(false)
    }
  }

  const markAsPaid = async (paymentId: string, walkinId: string) => {
    if (!paymentId) return
    const { error } = await supabase.from('payments').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('payment_id', paymentId)
    if (error) { toast.error('Failed to update payment'); return }
    toast.success('Payment marked as paid')
    setWalkIns(prev => prev.map(b => b.id === walkinId && b.payment ? { ...b, payment: { ...b.payment, status: 'paid' } } : b))
  }

  const updateStatus = async (walkinId: string, status: string) => {
    const { error } = await supabase.from('walkins').update({ status }).eq('walkin_id', walkinId)
    if (error) { toast.error('Failed to update status'); return }
    setWalkIns(prev => prev.map(w => w.id === walkinId ? { ...w, status } : w))
    toast.success(`Moved to ${status}`)
  }

  const pending = walkIns.filter(w => w.status === 'pending')
  const active = walkIns.filter(w => ['confirmed', 'processing'].includes(w.status))
  const history = walkIns.filter(w => ['completed', 'cancelled'].includes(w.status))

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Walk-ins</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Manage today's walk-in queue</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-zinc-100 rounded-lg p-1 text-sm gap-0.5">
            {(['queue', 'history'] as const).map(v => (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className={cn('px-3 py-1.5 rounded-md font-medium text-[12px] transition-colors capitalize', activeView === v ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800')}
              >
                {v === 'queue' ? `Queue (${pending.length + active.length})` : `History (${history.length})`}
              </button>
            ))}
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Walk-in
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>New Walk-in</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Full Name *</label>
                    <input className="w-full px-3 py-2 border border-zinc-200 rounded-lg outline-none focus:border-zinc-400 text-sm" placeholder="Maria Santos" {...register('guest_name')} />
                    {errors.guest_name && <p className="text-[11px] text-red-500">{errors.guest_name.message}</p>}
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Phone *</label>
                    <input className="w-full px-3 py-2 border border-zinc-200 rounded-lg outline-none focus:border-zinc-400 text-sm" placeholder="09XX XXX XXXX" {...register('guest_phone')} />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Service *</label>
                    <select className="w-full px-3 py-2 border border-zinc-200 rounded-lg outline-none focus:border-zinc-400 text-sm bg-white" {...register('service_id')}>
                      <option value="">Select service</option>
                      {services.map((s) => {
                        const svc = s as Record<string, string | number>
                        const id = String(svc.service_id || svc.id)
                        const name = String(svc.service_name || svc.name)
                        const price = Number(svc.price)
                        return <option key={id} value={id}>{name} — ₱{price.toLocaleString()}</option>
                      })}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Date *</label>
                    <input type="date" className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none" {...register('booking_date')} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Time *</label>
                    <input type="time" className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none" {...register('booking_time')} />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Payment Method</label>
                    <select className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-white outline-none" {...register('payment_method')}>
                      <option value="cash">Cash</option>
                      <option value="gcash_instore">GCash (In-store)</option>
                      <option value="gcash_online">GCash (Online)</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input type="checkbox" id="is_paid" className="rounded" {...register('is_paid')} />
                    <label htmlFor="is_paid" className="text-sm text-zinc-700">Mark as already paid</label>
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="w-full py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Walk-in'}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>
      ) : activeView === 'queue' ? (
        /* Split View: Pending (left) | Queue (right) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[600px]">
          {/* Left: Pending */}
          <div className="bg-white rounded-xl border border-zinc-100 flex flex-col">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">Pending</h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">Awaiting confirmation</p>
              </div>
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold flex items-center justify-center">
                {pending.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {pending.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-zinc-400 gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">No pending walk-ins</p>
                </div>
              ) : pending.map(w => (
                <WalkinCard key={w.id} walkin={w} onMarkPaid={markAsPaid} onMove={updateStatus} primaryAction={{ label: 'Move to Queue', status: 'confirmed' }} />
              ))}
            </div>
          </div>

          {/* Right: Active Queue */}
          <div className="bg-white rounded-xl border border-zinc-100 flex flex-col">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">Active Queue</h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">Currently processing</p>
              </div>
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center justify-center">
                {active.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {active.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-zinc-400 gap-2">
                  <Clock className="w-5 h-5" />
                  <p className="text-sm">Queue is empty</p>
                </div>
              ) : active.map((w, i) => (
                <WalkinCard key={w.id} walkin={w} onMarkPaid={markAsPaid} onMove={updateStatus} priority={i === 0} primaryAction={{ label: 'Complete', status: 'completed' }} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* History Table */
        <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100">
            <h2 className="text-sm font-semibold text-zinc-900">Walk-in History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50/80">
                  <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-left">Client</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-left">Service</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-left">Time</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-left">Payment</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {history.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-zinc-400">No history yet</td></tr>
                ) : history.map(w => (
                  <tr key={w.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-zinc-900">{w.guest_name}</p>
                      <p className="text-[11px] text-zinc-400">{w.guest_phone || '—'}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] text-zinc-900">{w.service?.name ?? '—'}</p>
                      <p className="text-[11px] text-zinc-400">₱{w.service?.price?.toLocaleString() ?? '0'}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-zinc-500">{w.booking_time}</td>
                    <td className="px-5 py-3.5">
                      {w.payment?.status === 'paid'
                        ? <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Paid</span>
                        : <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Pending</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-md border',
                        w.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                      )}>
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function WalkinCard({
  walkin, onMarkPaid, onMove, priority = false, primaryAction,
}: {
  walkin: AdminWalkin
  onMarkPaid: (pid: string, wid: string) => void
  onMove: (wid: string, status: string) => void
  priority?: boolean
  primaryAction: { label: string; status: string }
}) {
  return (
    <div className={cn(
      'p-4 rounded-xl border transition-all',
      priority ? 'border-zinc-900 bg-zinc-50 shadow-sm' : 'border-zinc-100 bg-white hover:border-zinc-200'
    )}>
      {priority && (
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-2">● Now Serving</div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-zinc-900 truncate">{walkin.guest_name}</p>
            <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
              <Phone className="w-2.5 h-2.5" />{walkin.guest_phone || '—'}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[12px] font-bold text-zinc-900 flex items-center gap-1 justify-end">
            <Clock className="w-3 h-3" />{walkin.booking_time}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-100">
        <p className="text-[12px] font-medium text-zinc-700">{walkin.service?.name ?? '—'}</p>
        <p className="text-[11px] text-zinc-400">₱{walkin.service?.price?.toLocaleString() ?? 0}</p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        {walkin.payment?.status === 'paid' ? (
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Paid
          </span>
        ) : (
          <button
            onClick={() => onMarkPaid(walkin.payment?.id || '', walkin.id)}
            className="text-[11px] font-medium text-zinc-500 hover:text-emerald-600 flex items-center gap-1 transition-colors"
          >
            <CreditCard className="w-3 h-3" /> Mark Paid
          </button>
        )}
        <button
          onClick={() => onMove(walkin.id, primaryAction.status)}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-md bg-zinc-900 text-white hover:bg-zinc-700 transition-colors"
        >
          {primaryAction.label}
        </button>
      </div>
    </div>
  )
}
