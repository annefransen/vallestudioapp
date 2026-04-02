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

    // Find payment by xendit_invoice_id (stored in reference_number in the new schema)
    const { data: payment, error: findError } = await supabase
      .from('payments')
      .select('payment_id, reservation_id')
      .eq('reference_number', xenditInvoiceId)
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
      .eq('payment_id', payment.payment_id)

    // Update reservation status
    if (paymentStatus === 'paid') {
      await supabase
        .from('reservation')
        .update({ payment_status: 'paid', status: 'confirmed' })
        .eq('reservation_id', payment.reservation_id)

      // Fetch booking details for email
      const { data: resData } = await supabase
        .from('reservation')
        .select(`
          reservation_id,
          reservation_date,
          start_time,
          profiles (first_name, gmail),
          guests (first_name, gmail),
          booking_items (
            services(service_name)
          )
        `)
        .eq('reservation_id', payment.reservation_id)
        .single()

      if (resData) {
        let guestEmail = (resData.profiles as any)?.gmail || (resData.guests as any)?.gmail
        let guestName = (resData.profiles as any)?.first_name || (resData.guests as any)?.first_name || 'Valued Client'
        
        let serviceName = 'Salon Service'
        if (resData.booking_items && resData.booking_items.length > 0) {
            // @ts-ignore
            serviceName = resData.booking_items[0].services?.service_name || serviceName
        }

        if (guestEmail) {
          const { resend } = await import('@/lib/resend')
          const { BookingConfirmationEmail } = await import('@/emails/BookingConfirmation')
          
          if (resend) {
            try {
              await resend.emails.send({
                from: 'Valle Studio <onboarding@resend.dev>',
                to: guestEmail,
                subject: 'Your Reservation at Valle Studio',
                react: BookingConfirmationEmail({
                  customerName: guestName,
                  bookingDate: resData.reservation_date,
                  bookingTime: resData.start_time,
                  serviceName: serviceName,
                  stylistName: 'Any Available',
                  bookingId: resData.reservation_id,
                }),
              })
            } catch (e) {
              console.error('Webhook Email send failed:', e)
            }
          }
        }
      }
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('Xendit webhook error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

