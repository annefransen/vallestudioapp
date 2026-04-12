import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkServices() {
  const { data, error } = await supabase
    .from('services')
    .select('service_id, service_name, category, status')
    .order('category')

  if (error) {
    console.error('Error fetching services:', error)
    return
  }

  console.log('--- Services Catalog ---')
  data.forEach((s) => {
    console.log(`[${s.category}] "${s.service_name}" (Status: ${s.status})`)
  })
}

checkServices()
