import { NextResponse } from 'next/server'
import { createBackend } from '@/lib/backend'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    let category = searchParams.get('category')
    const categoryIds = searchParams.get('categoryIds')
    const search = searchParams.get('search')
    const slug = searchParams.get('slug')
    const tag = searchParams.get('tag')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    console.log(' GET /api/products - Fetching products')
    
    // If category param is provided, resolve it and include all child categories
    if (category) {
      const supabase = await createClient()
      
      // First try to find by slug
      const { data: categoryBySlug } = await supabase
        .from('categories')
        .select('id, slug')
        .eq('slug', category)
        .single()
      
      if (categoryBySlug) {
        const categoryId = categoryBySlug.id
        
        // Get all child category IDs recursively
        const { data: allCategories } = await supabase
          .from('categories')
          .select('id, parent_id')
        
        const childIds = allCategories ? getChildCategoryIds(categoryId, allCategories) : []
        const allCategoryIds = [categoryId, ...childIds]
        
        console.log(`📂 Category "${category}" resolved to ID: ${categoryId}, with ${childIds.length} children`)
        
        // Always use categoryIds for consistent filtering
        const backend = await createBackend()
        const result = await backend.getProducts({
          categoryIds: allCategoryIds,
          search: search || undefined,
          slug: slug || undefined,
          tag: tag || undefined,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          sortBy,
          sortOrder: sortOrder as 'asc' | 'desc',
          page,
          limit,
        })
        console.log(`📦 GET /api/products - Returning ${result.products.length} products for category "${category}"`)
        return NextResponse.json(result)
      } else {
        console.warn(`⚠️ Category slug "${category}" not found in database`)
      }
    }
    
    const backend = await createBackend()

    const result = await backend.getProducts({
      category: category || undefined,
      categoryIds: categoryIds ? categoryIds.split(',') : undefined,
      search: search || undefined,
      slug: slug || undefined,
      tag: tag || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
      page,
      limit,
    })

    console.log(`📦 GET /api/products - Returning ${result.products.length} products`)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('❌ GET /api/products error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

function getChildCategoryIds(parentId: string, categories: any[]): string[] {
  const childIds: string[] = []
  for (const cat of categories) {
    if (cat.parent_id === parentId) {
      childIds.push(cat.id)
      childIds.push(...getChildCategoryIds(cat.id, categories))
    }
  }
  return childIds
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
    const backend = await createBackend()

    const product = await backend.createProduct(body)

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
