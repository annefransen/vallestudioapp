import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        const isInternalRedirect = next.startsWith('/')
        const redirectTo = isInternalRedirect ? `${origin}${next}` : next
        return NextResponse.redirect(redirectTo)
      }
      console.error('Auth callback exchange error:', error)
    } catch (err) {
      console.error('Unexpected auth callback error:', err)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
