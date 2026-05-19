import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    // First delete all subcategories
    const { error: subcategoriesError } = await supabase
      .from('categories')
      .delete()
      .eq('parent_id', id)

    if (subcategoriesError) throw subcategoriesError

    // Then delete the main category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
