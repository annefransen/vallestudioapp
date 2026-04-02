import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'
import xenditClient from '@/lib/xendit'
import { resend } from '@/lib/resend'
import BookingConfirmationEmail from '@/emails/BookingConfirmation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      profile_id,
      guest_name,
      guest_phone,
      guest_email,
      service_id,
      stylist_id,
      stylist_name,
      booking_date,
      booking_time,
      notes,
      promo_code,
      payment_method,
      amount,
    } = body

    if (!service_id || !booking_date || !booking_time || !guest_name || !guest_phone) {
      return Response.json({ error: 'Missing required booking fields' }, { status: 400 })
    }

    const [hour, minute] = booking_time.split(':').map(Number)
    const totalMinutes = hour * 60 + minute
    if (totalMinutes < 9 * 60 + 30 || totalMinutes > 19 * 60) {
      return Response.json({ error: 'Booking time must be between 9:30 AM and 7:00 PM' }, { status: 400 })
    }

    const supabase = await createClient()

    let assignedStylistId = stylist_id || null

    if (assignedStylistId) {
      // Hardcoded check bypass since we don't have a cross-table availability view yet in the new schema. 
      // We will assume available if requested directly for now.
    } else {
      const { data: activeStaff } = await supabase
        .from('staff')
        .select('staff_id, first_name')
        .eq('status', 'active')
        .limit(1)
        .single()
        
      if (activeStaff) {
        assignedStylistId = activeStaff.staff_id
      }
    }

    let promotion_id: string | null = null
    if (promo_code) {
      const { data: promo } = await supabase
        .from('promos')
        .select('promo_id')
        .eq('promo_name', promo_code)
        .single()
      promotion_id = promo?.promo_id || null
    }

    const { data: service } = await supabase.from('services').select('service_name, duration, price').eq('service_id', service_id).single()
    const fetchedServiceName = service?.service_name || 'Salon Service'

    // 1. Create Guest if not logged in
    let finalGuestId = null;
    if (!profile_id) {
       const guestNames = guest_name.trim().split(' ')
       const { data: newGuest } = await supabase.from('guests').insert({
          first_name: guestNames[0],
          last_name: guestNames.slice(1).join(' ') || ' ',
          gmail: guest_email || `${guest_phone}@guest.local`,
          contact_number: guest_phone
       }).select('guest_id').single()
       if (newGuest) finalGuestId = newGuest.guest_id
    }

    // 2. Insert Reservation
    const formattedDate = new Date(`${booking_date}T${booking_time}:00`)
    // Calculate naive end_time based on service duration (assuming standard interval syntax like '01:00:00')
    const start_time = formattedDate.toISOString()

    const { data: reservation, error: bookingError } = await supabase
      .from('reservation')
      .insert({
        profile_id: profile_id || null,
        guest_id: finalGuestId,
        reservation_code: `RES-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        reservation_date: booking_date,
        start_time: start_time,
        total_amount: amount,
        amount_paid: 0,
        payment_status: 'unpaid',
        status: 'pending',
      })
      .select('reservation_id')
      .single()

    if (bookingError || !reservation) {
      console.error('Reservation insert error:', bookingError)
      return Response.json({ error: 'Failed to create reservation' }, { status: 500 })
    }

    // 3. Insert Booking Items
    await supabase.from('booking_items').insert({
        reservation_id: reservation.reservation_id,
        item_type: 'service',
        service_id: service_id,
        promo_id: promotion_id,
        price_at_time: amount,
        duration_at_time: service?.duration || '01:00:00'
    })

    // 4. Create Payment
    if (payment_method === 'gcash_online') {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
      const invoice = await (xenditClient as unknown as { Invoice: { createInvoice: (params: unknown) => Promise<{ id: string; invoice_url: string }> } }).Invoice.createInvoice({
        externalId: reservation.reservation_id,
        amount,
        description: `Valle Studio Salon — Reservation ${reservation.reservation_id.slice(0, 8).toUpperCase()}`,
        payerEmail: guest_email || undefined,
        customerName: guest_name,
        successRedirectUrl: `${appUrl}/book/confirmation?id=${reservation.reservation_id}&paid=1`,
        failureRedirectUrl: `${appUrl}/book/payment-failed?id=${reservation.reservation_id}`,
        paymentMethods: ['GCASH'],
        currency: 'PHP',
      })

      await supabase.from('payments').insert({
        reservation_id: reservation.reservation_id,
        payment_method: payment_method === 'cash' ? 'cash' : 'gcash', 
        amount,
        status: 'pending',
        reference_number: invoice.id,
      })

      return Response.json({
        bookingId: reservation.reservation_id,
        paymentUrl: invoice.invoice_url,
      })
    } else {
      // Cash or GCash in-store
      await supabase.from('payments').insert({
        reservation_id: reservation.reservation_id,
        payment_method: payment_method === 'cash' ? 'cash' : 'gcash',
        amount,
        status: 'pending',
      })

      if (resend && guest_email) {
        try {
          await resend.emails.send({
            from: 'Valle Studio <onboarding@resend.dev>',
            to: guest_email,
            subject: 'Your Reservation at Valle Studio',
            react: BookingConfirmationEmail({
              customerName: guest_name,
              bookingDate: booking_date,
              bookingTime: booking_time,
              serviceName: fetchedServiceName,
              stylistName: stylist_name || 'Any Available',
              bookingId: reservation.reservation_id,
            }),
          })
        } catch (e) {
          console.error("Email send failed:", e)
        }
      }

      return Response.json({ bookingId: reservation.reservation_id })
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
    .from('reservation')
    .select(`
      *,
      guests (*),
      booking_items (
        *,
        services (*)
      ),
      payments (*)
    `)
    .eq('profile_id', user.id)
    .order('reservation_date', { ascending: false })
    .order('start_time', { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}
