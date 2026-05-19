import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 })
    }

    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    return NextResponse.json({ isAdmin: data?.role === 'admin' })
  } catch (error) {
    return NextResponse.json({ isAdmin: false }, { status: 500 })
  }
}
