'use client'

import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Plus, Loader2, UserPlus, Banknote, Smartphone, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import type { Booking, Service } from '@/types'
import { toast } from 'sonner'
import { format as formatDate } from 'date-fns'

const schema = z.object({
  guest_name: z.string().min(2, 'Name required'),
  guest_phone: z.string().min(7, 'Phone required'),
  service_id: z.string().min(1, 'Service required'),
  booking_date: z.string().min(1, 'Date required'),
  booking_time: z.string().min(1, 'Time required'),
  payment_method: z.enum(['cash', 'gcash_instore', 'gcash_online']),
  is_paid: z.boolean().default(false),
})
type FormData = z.infer<typeof schema>

export type AdminWalkin = {
  id: string
  guest_name: string
  guest_phone: string
  booking_date: string
  booking_time: string
  service: { name: string; category: string; price: number } | null
  payment: { id: string; method: string; status: string; amount: number } | null
}

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`
}

export default function WalkInsPage() {
  const [walkIns, setWalkIns] = useState<AdminWalkin[]>([])
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      payment_method: 'cash',
      is_paid: false,
      booking_date: formatDate(new Date(), 'yyyy-MM-dd'),
    },
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [wRes, sRes] = await Promise.all([
      supabase
        .from('walkins')
        .select('*, guests(*), booking_items(*, services(*)), payments(*)')
        .order('created_at', { ascending: false }),
      supabase.from('services').select('*').in('status', ['available', 'active']).order('category'),
    ])
    
    // Normalize data to standard Booking format
    const normalized = (wRes.data ?? []).map(w => {
      const d = w.start_time ? new Date(w.start_time) : new Date()
      const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      const guestName = w.guests ? `${w.guests.first_name || ''} ${w.guests.last_name || ''}`.trim() : 'Walk-in Guest'
      const service = w.booking_items?.[0]?.services
      const payment = w.payments?.[0]
      return {
        id: w.walkin_id,
        guest_name: guestName,
        guest_phone: w.guests?.phone || '',
        booking_date: w.walkin_date,
        booking_time: timeStr,
        service: service ? { name: service.service_name, category: service.category, price: service.price } : null,
        payment: payment ? { id: payment.payment_id, method: payment.payment_method, status: payment.status, amount: payment.amount } : null,
      }
    })

    setWalkIns(normalized as any[])
    setServices(sRes.data ?? [])
    setLoading(false)
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    const service = services.find(s => s.id === data.service_id) || services.find(s => (s as any).service_id === data.service_id)
    if (!service) return

    try {
      // 1. Create Guest
      const [firstName, ...lastNameParts] = data.guest_name.split(' ')
      const lastName = lastNameParts.join(' ') || 'Walk-in'
      
      const { data: guestData, error: guestErr } = await supabase
        .from('guests')
        .insert({
          first_name: firstName,
          last_name: lastName,
          phone: data.guest_phone,
          role: 'walkin'
        })
        .select('guest_id')
        .single()
        
      if (guestErr || !guestData) throw new Error('Failed to associate walk-in guest')

      // 2. Create Walkin
      const startTimeISO = new Date(`${data.booking_date}T${data.booking_time}:00`).toISOString()
      const { data: walkinData, error: walkinErr } = await supabase
        .from('walkins')
        .insert({
          guest_id: guestData.guest_id,
          walkin_date: data.booking_date,
          start_time: startTimeISO,
          status: 'completed',
          notes: 'Added via Admin Dashboard'
        })
        .select('walkin_id')
        .single()

      if (walkinErr || !walkinData) throw new Error('Failed to create walk_in record')

      // 3. Create Booking Item
      await supabase.from('booking_items').insert({
        walkin_id: walkinData.walkin_id,
        item_type: 'service',
        service_id: (service as any).service_id || service.id,
        price_at_time: service.price,
        duration_at_time: (service as any).duration || '00:30:00',
      })

      // 4. Create Payment
      await supabase.from('payments').insert({
        walkin_id: walkinData.walkin_id,
        payment_method: data.payment_method,
        amount: service.price,
        status: data.is_paid ? 'paid' : 'pending',
        paid_at: data.is_paid ? new Date().toISOString() : null,
      })

      toast.success('Walk-in added successfully!')
      reset()
      setOpen(false)
      loadData()
    } catch (err: any) {
      toast.error(err.message || 'Transaction failed')
    } finally {
      setSubmitting(false)
    }
  }

  const markAsPaid = async (paymentId: string, walkinId: string) => {
    if (!paymentId) return
    const { error } = await supabase
      .from('payments')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('payment_id', paymentId)

    if (error) {
      toast.error('Failed to update payment')
      return
    }

    toast.success('Payment marked as paid')
    setWalkIns(prev =>
      prev.map(b =>
        b.id === walkinId
          ? { ...b, payment: b.payment ? { ...b.payment, status: 'paid' } : b.payment }
          : b
      )
    )
  }

  const selectedServiceId = watch('service_id')
  const selectedService = services.find(s => s.id === selectedServiceId || (s as any).service_id === selectedServiceId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Walk-ins</h1>
          <p className="text-muted-foreground text-sm mt-1">Add and manage walk-in customers</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="gradient-brand text-white border-0 shadow-sm shadow-primary/30">
                <Plus className="w-4 h-4 mr-2" />
                Add Walk-in
              </Button>
            }
          />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Walk-in Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="walkin-name">Full Name *</Label>
                  <Input id="walkin-name" placeholder="Maria Santos" {...register('guest_name')} />
                  {errors.guest_name && <p className="text-xs text-destructive">{errors.guest_name.message}</p>}
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="walkin-phone">Phone *</Label>
                  <Input id="walkin-phone" placeholder="09XX XXX XXXX" {...register('guest_phone')} />
                  {errors.guest_phone && <p className="text-xs text-destructive">{errors.guest_phone.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Service *</Label>
                <Select onValueChange={(v) => setValue('service_id', v as string)}>
                  <SelectTrigger id="walkin-service">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s: any) => (
                      <SelectItem key={s.service_id || s.id} value={s.service_id || s.id}>
                        {s.service_name || s.name} — ₱{s.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service_id && <p className="text-xs text-destructive">{errors.service_id.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="walkin-date">Date *</Label>
                  <Input id="walkin-date" type="date" {...register('booking_date')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="walkin-time">Time *</Label>
                  <Input id="walkin-time" type="time" min="09:30" max="19:00" {...register('booking_time')} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Payment Method *</Label>
                <Select onValueChange={(v) => setValue('payment_method', v as FormData['payment_method'])} defaultValue="cash">
                  <SelectTrigger id="walkin-payment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="gcash_instore">GCash (In-store)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_paid')}
                  className="rounded border-border"
                  id="walkin-is-paid"
                />
                <span className="text-sm">Mark as already paid</span>
              </label>

              {selectedService && (
                <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm">
                  <span className="text-muted-foreground">Total: </span>
                  <span className="font-bold text-primary">₱{selectedService.price.toLocaleString()}</span>
                </div>
              )}

              <Button type="submit" className="w-full gradient-brand text-white border-0" disabled={submitting}>
                {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding…</> : 'Add Walk-in'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : walkIns.length === 0 ? (
        <Card className="border-border/50 p-12 text-center">
          <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-semibold">No walk-ins yet today</p>
          <p className="text-sm text-muted-foreground mt-1">Click &ldquo;Add Walk-in&rdquo; to add a customer.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {walkIns.map(walkin => (
            <Card key={walkin.id} className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{walkin.guest_name}</p>
                    <p className="text-xs text-muted-foreground">{walkin.guest_phone}</p>
                  </div>
                  <Badge variant="secondary" className="bg-purple-50 text-purple-600 border-purple-200">Walk-in</Badge>
                </div>

                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>{walkin.service?.name} · ₱{walkin.service?.price.toLocaleString()}</p>
                  <p>{format(parseISO(walkin.booking_date), 'MMM d, yyyy')} at {walkin.booking_time}</p>
                </div>

                {walkin.payment && (
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
                      {walkin.payment.method === 'cash' ? <Banknote className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                      {walkin.payment.method.replace(/_/g, ' ')}
                    </div>
                    {walkin.payment.status === 'paid' ? (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />Paid
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-green-200 text-green-700 hover:bg-green-50"
                        onClick={() => markAsPaid(walkin.payment!.id, walkin.id)}
                        id={`mark-paid-${walkin.id}`}
                      >
                        Mark as Paid
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
