import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(name, slug)')
      .eq('id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    const body = await request.json()
    console.log('PUT /api/products/[id] received:', JSON.stringify(body, null, 2))
    const { variations, ...productData } = body

    // Remove undefined values from productData
    Object.keys(productData).forEach((key) => {
      if ((productData as any)[key] === undefined || (productData as any)[key] === 'undefined') {
        delete (productData as any)[key]
      }
    })

    console.log('Sending to Supabase:', JSON.stringify(productData, null, 2))

    // Update product
    const { data: product, error: productError } = await supabase
      .from('products')
      .update(productData)
      .eq('id', params.id)
      .select()
      .single()

    if (productError) throw productError

    // Handle variations
    if (variations) {
      // Delete existing variations
      await supabase
        .from('product_variations')
        .delete()
        .eq('product_id', params.id)

      // Insert new variations
      if (variations.length > 0) {
        const variationsWithProductId = variations.map((v: any) => ({
          ...v,
          product_id: params.id,
        }))

        await supabase
          .from('product_variations')
          .insert(variationsWithProductId)
      }
    }

    return NextResponse.json(product)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
