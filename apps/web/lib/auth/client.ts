import { createBrowserClient } from '@supabase/ssr'

export function createAuthClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createAuthClient()
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  const supabase = createAuthClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })

  if (!error && data.user) {
    await supabase.from('users').insert({
      id: data.user.id,
      email: data.user.email,
      name,
      role: 'customer',
    })
  }

  return { data, error }
}

export async function signInWithGoogle() {
  const supabase = createAuthClient()
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  })
}

export async function signInWithPhone(phone: string) {
  const supabase = createAuthClient()
  return supabase.auth.signInWithOtp({
    phone,
  })
}

export async function verifyPhoneOtp(phone: string, token: string) {
  const supabase = createAuthClient()
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })

  if (!error && data.user) {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', data.user.id)
      .single()

    if (!existingUser) {
      await supabase.from('users').insert({
        id: data.user.id,
        phone,
        role: 'customer',
      })
    }
  }

  return { data, error }
}

export async function signOut() {
  const supabase = createAuthClient()
  return supabase.auth.signOut()
}

export async function getCurrentUser() {
  const supabase = createAuthClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const supabase = createAuthClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function resetPassword(email: string) {
  const supabase = createAuthClient()
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/reset-password`,
  })
}

export async function updatePassword(password: string) {
  const supabase = createAuthClient()
  return supabase.auth.updateUser({ password })
}
