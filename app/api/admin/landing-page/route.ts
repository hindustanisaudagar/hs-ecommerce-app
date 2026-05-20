import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    const supabase = await createClient()

    if (section) {
      // Fetch single section
      const { data, error } = await supabase
        .from('landing_page_content')
        .select('section, content')
        .eq('section', section)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Section not found' }, { status: 404 })
        }
        throw error
      }

      return NextResponse.json(data)
    }

    // Fetch all sections
    const { data, error } = await supabase
      .from('landing_page_content')
      .select('section, content')
      .order('section')

    if (error) throw error

    // Convert to object with section as key
    const content = {}
    data?.forEach((item) => {
      content[item.section] = item.content
    })

    return NextResponse.json(content)
  } catch (error: any) {
    console.error('GET /api/admin/landing-page error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { section, content } = body

    if (!section || !content) {
      return NextResponse.json(
        { error: 'Section and content are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('landing_page_content')
      .upsert(
        {
          section,
          content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'section' }
      )
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('POST /api/admin/landing-page error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
