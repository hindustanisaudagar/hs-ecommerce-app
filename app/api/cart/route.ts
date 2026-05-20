import { NextResponse } from 'next/server'
import { createBackend } from '@/lib/backend'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ items: [] })
    }

    const backend = await createBackend()
    const items = await backend.getCart(user.id)

    return NextResponse.json({ items })
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

    const body = await request.json()
    const { product_id, quantity = 1, variation_id } = body

    const backend = await createBackend()
    const data = await backend.addToCart(user.id, product_id, quantity, variation_id)

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { product_id, quantity } = body

    const backend = await createBackend()

    if (quantity <= 0) {
      await backend.removeFromCart(user.id, product_id)
      return NextResponse.json({ success: true })
    }

    await backend.updateCart(user.id, product_id, quantity)
    const items = await backend.getCart(user.id)
    const updatedItem = items.find((item: any) => item.product_id === product_id)

    return NextResponse.json(updatedItem || { success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const product_id = searchParams.get('product_id')

    if (!product_id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    const backend = await createBackend()
    await backend.removeFromCart(user.id, product_id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
