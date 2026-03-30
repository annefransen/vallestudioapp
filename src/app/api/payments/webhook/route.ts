import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

// Xendit webhook verification token from env
const WEBHOOK_TOKEN = process.env.XENDIT_WEBHOOK_TOKEN ?? ''

export async function POST(request: NextRequest) {
  try {
    // Verify Xendit webhook token
    const callbackToken = request.headers.get('x-callback-token')
    if (WEBHOOK_TOKEN && callbackToken !== WEBHOOK_TOKEN) {
      return Response.json({ error: 'Invalid webhook token' }, { status: 401 })
    }

    const body = await request.json()
    const { id: xenditInvoiceId, status, paid_at } = body

    if (!xenditInvoiceId) {
      return Response.json({ error: 'Missing invoice ID' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // Find payment by xendit_invoice_id
    const { data: payment, error: findError } = await supabase
      .from('payments')
      .select('id, booking_id')
      .eq('xendit_invoice_id', xenditInvoiceId)
      .single()

    if (findError || !payment) {
      console.error('Payment not found for invoice:', xenditInvoiceId)
      return Response.json({ error: 'Payment not found' }, { status: 404 })
    }

    const paymentStatus = status === 'PAID' || status === 'SETTLED' ? 'paid' : 'failed'

    // Update payment status
    await supabase
      .from('payments')
      .update({
        status: paymentStatus,
        paid_at: paymentStatus === 'paid' ? (paid_at ?? new Date().toISOString()) : null,
      })
      .eq('id', payment.id)

    // Update booking status
    if (paymentStatus === 'paid') {
      await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', payment.booking_id)
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('Xendit webhook error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
