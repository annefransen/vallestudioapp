import { createClient } from '@supabase/supabase-js'

// Simple script to test the schema from Supabase directly
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function run() {
  console.log("Testing Reservations Query...")
  const { data: resData, error: resErr } = await supabase
    .from('reservation')
    .select(`
      *,
      profiles (first_name, last_name, phone),
      guests (first_name, last_name, phone),
      booking_items (*, services(service_name, category, price)),
      payments (*)
    `)
    .limit(1)

  console.log("reservation query error:", JSON.stringify(resErr, null, 2))
  
  if (resErr) {
    console.log("Trying simpler reservation query...")
    const { error: simpleErr } = await supabase.from('reservation').select('*').limit(1)
    console.log("simple reservation error:", JSON.stringify(simpleErr, null, 2))
  }

  console.log("\nTesting Payments Query...")
  const { data: payData, error: payErr } = await supabase
    .from('payments')
    .select(`
      *,
      reservation:reservation_id (
        reservation_date, start_time,
        profiles (first_name, last_name, phone),
        guests (first_name, last_name, phone),
        booking_items (services(service_name, price))
      ),
      walkins:walkin_id (
        walkin_date, start_time,
        guests (first_name, last_name, phone),
        booking_items (services(service_name, price))
      )
    `)
    .limit(1)
    
  console.log("payments query error:", JSON.stringify(payErr, null, 2))
}

run().catch(console.error)
