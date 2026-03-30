'use client'

import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { CheckCircle2, Clock, Loader2, CreditCard, Banknote, Smartphone, Globe, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import type { Payment, PaymentStatus } from '@/types'
import { toast } from 'sonner'

type PaymentWithBooking = Payment & {
  booking: {
    guest_name: string | null
    guest_phone: string | null
    booking_date: string
    booking_time: string
    service: { name: string; price: number } | null
  } | null
}

const METHOD_CONFIG = {
  cash: { label: 'Cash', icon: Banknote, className: 'text-green-600' },
  gcash_instore: { label: 'GCash (In-store)', icon: Smartphone, className: 'text-blue-600' },
  gcash_online: { label: 'GCash Online', icon: Globe, className: 'text-purple-600' },
}

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentWithBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const supabase = createClient()

  const loadPayments = async () => {
    let query = supabase
      .from('payments')
      .select(`
        *,
        booking:bookings(
          guest_name, guest_phone, booking_date, booking_time,
          service:services(name, price)
        )
      `)
      .order('created_at', { ascending: false })

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query
    if (!error) setPayments((data as unknown as PaymentWithBooking[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { loadPayments() }, [statusFilter])

  const markAsPaid = async (paymentId: string) => {
    setUpdatingId(paymentId)
    const { error } = await supabase
      .from('payments')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', paymentId)

    if (error) {
      toast.error('Failed to update payment')
    } else {
      toast.success('Payment marked as paid!')
      setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'paid' } : p))
    }
    setUpdatingId(null)
  }

  // Summary totals
  const sumPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const sumPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Payments</h1>
        <p className="text-muted-foreground text-sm mt-1">Track and manage all payment transactions</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="border-border/50 p-5">
          <p className="text-xl font-bold text-green-600">₱{sumPaid.toLocaleString('en-PH')}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Total Collected</p>
        </Card>
        <Card className="border-border/50 p-5">
          <p className="text-xl font-bold text-amber-600">₱{sumPending.toLocaleString('en-PH')}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Pending Collection</p>
        </Card>
        <Card className="border-border/50 p-5 col-span-2 sm:col-span-1">
          <p className="text-xl font-bold text-primary">₱{(sumPaid + sumPending).toLocaleString('en-PH')}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Total Revenue</p>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex justify-end">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | PaymentStatus)}>
          <SelectTrigger className="w-44" id="payment-filter">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : payments.length === 0 ? (
        <Card className="border-border/50 p-12 text-center">
          <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-semibold">No payments found</p>
        </Card>
      ) : (
        <Card className="border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Client</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Service & Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Method</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map(payment => {
                const method = METHOD_CONFIG[payment.method]
                const MethodIcon = method.icon
                const isUpdating = updatingId === payment.id
                return (
                  <tr key={payment.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium">{payment.booking?.guest_name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground">{payment.booking?.guest_phone}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-muted-foreground">
                      <p className="text-foreground font-medium">{payment.booking?.service?.name}</p>
                      <p className="text-xs">
                        {payment.booking?.booking_date ? format(parseISO(payment.booking.booking_date), 'MMM d, yyyy') : '—'}
                        {payment.booking?.booking_time ? ` at ${formatTime(payment.booking.booking_time)}` : ''}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${method.className}`}>
                        <MethodIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{method.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-primary">
                      ₱{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      {payment.status === 'paid' ? (
                        <Badge variant="secondary" className="status-completed text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />Paid
                        </Badge>
                      ) : payment.status === 'failed' ? (
                        <Badge variant="secondary" className="status-cancelled text-xs">Failed</Badge>
                      ) : (
                        <Badge variant="secondary" className="status-pending text-xs">
                          <Clock className="w-3 h-3 mr-1" />Pending
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {payment.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-green-200 text-green-700 hover:bg-green-50"
                          onClick={() => markAsPaid(payment.id)}
                          disabled={isUpdating}
                          id={`mark-paid-${payment.id}`}
                        >
                          {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Mark Paid'}
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
            {payments.length} transactions
          </div>
        </Card>
      )}
    </div>
  )
}
