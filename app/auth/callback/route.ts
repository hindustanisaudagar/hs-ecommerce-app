import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth/server'

export async function GET() {
  const user = await getServerUser()

  if (user) {
    redirect('/account')
  }

  redirect('/auth/login')
}
