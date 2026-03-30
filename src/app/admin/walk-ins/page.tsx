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

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`
}

export default function WalkInsPage() {
  const [walkIns, setWalkIns] = useState<Booking[]>([])
  const [services, setServices] = useState<Service[]>([])
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
        .from('bookings')
        .select('*, service:services(name, category, price), payment:payments(*)')
        .eq('is_walkin', true)
        .order('created_at', { ascending: false }),
      supabase.from('services').select('*').eq('is_active', true).order('category'),
    ])
    setWalkIns(wRes.data ?? [])
    setServices(sRes.data ?? [])
    setLoading(false)
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    const service = services.find(s => s.id === data.service_id)
    if (!service) return

    // Create booking
    const { data: booking, error: bErr } = await supabase
      .from('bookings')
      .insert({
        guest_name: data.guest_name,
        guest_phone: data.guest_phone,
        service_id: data.service_id,
        booking_date: data.booking_date,
        booking_time: data.booking_time,
        status: 'confirmed',
        is_walkin: true,
      })
      .select('id')
      .single()

    if (bErr || !booking) {
      toast.error('Failed to add walk-in')
      setSubmitting(false)
      return
    }

    // Create payment record
    await supabase.from('payments').insert({
      booking_id: booking.id,
      method: data.payment_method,
      amount: service.price,
      status: data.is_paid ? 'paid' : 'pending',
      paid_at: data.is_paid ? new Date().toISOString() : null,
    })

    toast.success('Walk-in added successfully!')
    reset()
    setOpen(false)
    loadData()
    setSubmitting(false)
  }

  const markAsPaid = async (paymentId: string, bookingId: string) => {
    const { error } = await supabase
      .from('payments')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', paymentId)

    if (error) {
      toast.error('Failed to update payment')
      return
    }

    toast.success('Payment marked as paid')
    setWalkIns(prev =>
      prev.map(b =>
        b.id === bookingId
          ? { ...b, payment: b.payment ? { ...b.payment, status: 'paid' } : b.payment }
          : b
      )
    )
  }

  const selectedServiceId = watch('service_id')
  const selectedService = services.find(s => s.id === selectedServiceId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Walk-ins</h1>
          <p className="text-muted-foreground text-sm mt-1">Add and manage walk-in customers</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}></DialogTrigger>
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
                    {services.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} — ₱{s.price.toLocaleString()}
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
                  <p>{format(parseISO(walkin.booking_date), 'MMM d, yyyy')} at {formatTime(walkin.booking_time)}</p>
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
