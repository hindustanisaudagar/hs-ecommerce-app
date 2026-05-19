import { redirect } from 'next/navigation'
import { createAuthServerClient } from '@/lib/auth/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = await createAuthServerClient()
    await supabase.auth.exchangeCodeForSession(code)
  }
  
  const supabase = await createAuthServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/account')
  }
  
  redirect('/auth/login')
}
