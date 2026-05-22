import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('wholesale_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'No settings found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('GET /api/admin/deals error:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const body = await req.json()

    const payload: any = {}
    if (body.id) payload.id = body.id
    if (body.title !== undefined) payload.title = body.title
    if (body.banner_url !== undefined) payload.banner_url = body.banner_url
    if (body.content !== undefined) payload.content = body.content

    const { data, error } = await supabase
      .from('wholesale_settings')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('POST /api/admin/deals error:', error)
    return NextResponse.json({ error: error.message || 'Failed to save' }, { status: 500 })
  }
}
