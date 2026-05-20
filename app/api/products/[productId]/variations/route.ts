import { NextResponse } from 'next/server'
import { createBackend } from '@/lib/backend'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const backend = await createBackend()
    const variations = await backend.getProductVariations(productId)

    return NextResponse.json({ variations })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
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

    const product = await backend.getProduct(productId)
    const currentVariations = await backend.getProductVariations(productId)
    
    const updatedProduct = await backend.updateProduct(productId, {
      ...product,
      variations: [...currentVariations, { ...body, product_id: productId }],
    })

    const newVariations = await backend.getProductVariations(productId)
    const newVariation = newVariations[newVariations.length - 1]

    return NextResponse.json(newVariation, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ productId: string; variationId: string }> }
) {
  try {
    const { productId, variationId } = await params
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

    const product = await backend.getProduct(productId)
    const variations = await backend.getProductVariations(productId)
    
    const updatedVariations = variations.map((v: any) => 
      v.id === variationId ? { ...v, ...body } : v
    )

    await backend.updateProduct(productId, {
      ...product,
      variations: updatedVariations,
    })

    const newVariations = await backend.getProductVariations(productId)
    const updatedVariation = newVariations.find((v: any) => v.id === variationId)

    return NextResponse.json(updatedVariation)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ productId: string; variationId: string }> }
) {
  try {
    const { productId, variationId } = await params
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

    const backend = await createBackend()

    const product = await backend.getProduct(productId)
    const variations = await backend.getProductVariations(productId)
    
    const updatedVariations = variations.filter((v: any) => v.id !== variationId)

    await backend.updateProduct(productId, {
      ...product,
      variations: updatedVariations,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
