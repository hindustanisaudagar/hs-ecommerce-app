import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth/server'

export default async function AuthCallbackPage() {
  const user = await getServerUser()

  if (user) {
    redirect('/account')
  }

  redirect('/auth/login')
}
