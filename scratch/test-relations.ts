import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testRelations() {
  console.log("Testing Reservation -> Profiles...")
  const res1 = await supabase.from('reservation').select('reservation_id, profiles(id)').limit(1)
  console.log("-> profiles:", res1.error?.message || "OK")

  console.log("Testing Reservation -> Guests...")
  const res2 = await supabase.from('reservation').select('reservation_id, guests(id)').limit(1)
  console.log("-> guests:", res2.error?.message || "OK")

  console.log("Testing Reservation -> Booking Items...")
  const res3 = await supabase.from('reservation').select('reservation_id, booking_items(booking_item_id)').limit(1)
  console.log("-> booking_items:", res3.error?.message || "OK")

  console.log("Testing Reservation -> Payments...")
  const res4 = await supabase.from('reservation').select('reservation_id, payments(payment_id)').limit(1)
  console.log("-> payments:", res4.error?.message || "OK")

  console.log("Testing Payments -> Reservation...")
  const res5 = await supabase.from('payments').select('payment_id, reservation:reservation_id(reservation_id)').limit(1)
  console.log("-> reservation:", res5.error?.message || "OK")

  console.log("Testing Payments -> Walkins...")
  const res6 = await supabase.from('payments').select('payment_id, walkins:walkin_id(walkin_id)').limit(1)
  console.log("-> walkins:", res6.error?.message || "OK")

  console.log("Testing Booking Items -> Services...")
  const res7 = await supabase.from('booking_items').select('booking_item_id, services(service_id)').limit(1)
  console.log("-> services:", res7.error?.message || "OK")

  console.log("Testing Reservation -> Staff...")
  const res8 = await supabase.from('reservation').select('reservation_id, staff(staff_id)').limit(1)
  console.log("-> staff:", res8.error?.message || "OK")
}

testRelations().catch(console.error)
