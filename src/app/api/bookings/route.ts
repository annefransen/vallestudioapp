import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'
import xenditClient from '@/lib/xendit'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      profile_id,
      guest_name,
      guest_phone,
      guest_email,
      service_id,
      stylist_name,
      booking_date,
      booking_time,
      notes,
      promo_code,
      payment_method,
      amount,
    } = body

    // Validate required fields
    if (!service_id || !booking_date || !booking_time || !guest_name || !guest_phone) {
      return Response.json({ error: 'Missing required booking fields' }, { status: 400 })
    }

    // Validate booking time is within salon hours (9:30 – 19:00)
    const [hour, minute] = booking_time.split(':').map(Number)
    const totalMinutes = hour * 60 + minute
    if (totalMinutes < 9 * 60 + 30 || totalMinutes > 19 * 60) {
      return Response.json({ error: 'Booking time must be between 9:30 AM and 7:00 PM' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if slot is already taken
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('booking_date', booking_date)
      .eq('booking_time', booking_time)
      .not('status', 'in', '("cancelled","no_show")')
      .single()

    if (existingBooking) {
      return Response.json({ error: 'This time slot is no longer available. Please choose another time.' }, { status: 409 })
    }

    // Resolve promo ID if code provided
    let promotion_id: string | null = null
    if (promo_code) {
      const { data: promo } = await supabase
        .from('promotions')
        .select('id')
        .eq('code', promo_code)
        .single()
      promotion_id = promo?.id ?? null
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        profile_id,
        guest_name,
        guest_phone,
        guest_email,
        service_id,
        stylist_name,
        booking_date,
        booking_time,
        notes,
        promotion_id,
        status: 'confirmed',
        is_walkin: false,
      })
      .select('id')
      .single()

    if (bookingError || !booking) {
      console.error('Booking insert error:', bookingError)
      return Response.json({ error: 'Failed to create booking' }, { status: 500 })
    }

    // Create payment record
    if (payment_method === 'gcash_online') {
      // Create Xendit invoice
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
      
      const invoice = await (xenditClient as unknown as { Invoice: { createInvoice: (params: unknown) => Promise<{ id: string; invoice_url: string }> } }).Invoice.createInvoice({
        externalId: booking.id,
        amount,
        description: `Valle Studio Salon — Booking ${booking.id.slice(0, 8).toUpperCase()}`,
        payerEmail: guest_email || undefined,
        customerName: guest_name,
        successRedirectUrl: `${appUrl}/book/confirmation?id=${booking.id}&paid=1`,
        failureRedirectUrl: `${appUrl}/book/payment-failed?id=${booking.id}`,
        paymentMethods: ['GCASH'],
        currency: 'PHP',
      })

      // Store payment with xendit invoice details
      await supabase.from('payments').insert({
        booking_id: booking.id,
        method: payment_method,
        amount,
        status: 'pending',
        xendit_invoice_id: invoice.id,
        xendit_invoice_url: invoice.invoice_url,
      })

      // Increment promo usage
      if (promotion_id) {
        await supabase.rpc('increment_promo_usage', { promo_id: promotion_id })
      }

      return Response.json({
        bookingId: booking.id,
        paymentUrl: invoice.invoice_url,
      })
    } else {
      // Cash or GCash in-store
      await supabase.from('payments').insert({
        booking_id: booking.id,
        method: payment_method,
        amount,
        status: 'pending',
      })

      // Increment promo usage
      if (promotion_id) {
        await supabase.rpc('increment_promo_usage', { promo_id: promotion_id })
      }

      return Response.json({ bookingId: booking.id })
    }
  } catch (err) {
    console.error('Booking API error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const profileId = searchParams.get('profile_id')

  if (profileId !== user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*, service:services(*), payment:payments(*)')
    .eq('profile_id', user.id)
    .order('booking_date', { ascending: false })
    .order('booking_time', { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}
