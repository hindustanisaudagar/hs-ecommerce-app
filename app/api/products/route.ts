import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const categoryIds = searchParams.get('categoryIds')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const supabase = await createClient()

    let query = supabase
      .from('products')
      .select('*, category:categories(name, slug)')
      .eq('is_active', true)

    if (category) {
      query = query.eq('category_id', category)
    }

    if (categoryIds) {
      const ids = categoryIds.split(',')
      query = query.overlaps('category_ids', ids)
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    if (minPrice) {
      query = query.gte('price', minPrice)
    }

    if (maxPrice) {
      query = query.lte('price', maxPrice)
    }

    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * limit, page * limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      products: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error: any) {
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

    // Extract variations from body
    const { variations, ...productData } = body

    // Insert product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (productError) throw productError

    // Insert variations if any
    if (variations && variations.length > 0 && product) {
      const variationsWithProductId = variations.map((v: any) => ({
        ...v,
        product_id: product.id,
      }))

      const { error: variationsError } = await supabase
        .from('product_variations')
        .insert(variationsWithProductId)

      if (variationsError) {
        console.error('Failed to insert variations:', variationsError)
      }
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
