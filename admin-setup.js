require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

async function setupAdmin() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const email = 'adminvalle@gmail.com'
  const password = 'password123'

  console.log('Checking for existing user...')
  
  // Try to create the user
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'admin' }
  })

  let userId;

  if (createError) {
    if (createError.message.includes('already exists')) {
      console.log('User already exists, updating password...')
      // Update password just to be sure
      const { data: listData } = await supabase.auth.admin.listUsers()
      const existingUser = listData.users.find(u => u.email === email)
      if (existingUser) {
        await supabase.auth.admin.updateUserById(existingUser.id, { password })
        userId = existingUser.id
      }
    } else {
      console.error('Error creating user:', createError)
      return
    }
  } else {
    userId = user.user.id
    console.log('Created new user successfully.')
  }

  // Ensure role is admin
  console.log('Setting admin role in profiles table...')
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', userId)

  if (profileError) {
    console.error('Failed to update profile role:', profileError)
  } else {
    console.log('\n✅ Success! You can now log in.')
    console.log('Email:', email)
    console.log('Password:', password)
  }
}

setupAdmin()
