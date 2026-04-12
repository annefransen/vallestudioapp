import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkRoles() {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
  
  if (error) {
    console.error(error)
    return
  }
  
  console.log('Staff members in DB:', JSON.stringify(data, null, 2))
}

checkRoles()
