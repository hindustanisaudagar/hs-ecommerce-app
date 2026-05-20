import { NextResponse } from 'next/server'
import { createBackend } from '@/lib/backend'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const backend = await createBackend()
    const variations = await backend.getProductVariations(params.productId)

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
  { params }: { params: { productId: string } }
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

    const body = await request.json()
    const backend = await createBackend()

    const product = await backend.getProduct(params.productId)
    const currentVariations = await backend.getProductVariations(params.productId)
    
    const updatedProduct = await backend.updateProduct(params.productId, {
      ...product,
      variations: [...currentVariations, { ...body, product_id: params.productId }],
    })

    const newVariations = await backend.getProductVariations(params.productId)
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
  { params }: { params: { productId: string; variationId: string } }
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

    const body = await request.json()
    const backend = await createBackend()

    const product = await backend.getProduct(params.productId)
    const variations = await backend.getProductVariations(params.productId)
    
    const updatedVariations = variations.map((v: any) => 
      v.id === params.variationId ? { ...v, ...body } : v
    )

    await backend.updateProduct(params.productId, {
      ...product,
      variations: updatedVariations,
    })

    const newVariations = await backend.getProductVariations(params.productId)
    const updatedVariation = newVariations.find((v: any) => v.id === params.variationId)

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
  { params }: { params: { productId: string; variationId: string } }
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

    const backend = await createBackend()

    const product = await backend.getProduct(params.productId)
    const variations = await backend.getProductVariations(params.productId)
    
    const updatedVariations = variations.filter((v: any) => v.id !== params.variationId)

    await backend.updateProduct(params.productId, {
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
