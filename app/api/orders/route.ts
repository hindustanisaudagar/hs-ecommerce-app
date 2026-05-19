import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createRazorpayOrder } from '@/lib/razorpay'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')

    if (orderId) {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(product:products(*))')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(product:products(name, images))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
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
    const { items, shipping_address, billing_address, payment_method } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    const total_amount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )

    const razorpayOrder = await createRazorpayOrder(total_amount)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          total_amount,
          shipping_address,
          billing_address,
          payment_method,
          razorpay_order_id: razorpayOrder.id,
          status: 'pending',
        },
      ])
      .select()
      .single()

    if (orderError) throw orderError

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    return NextResponse.json({
      order,
      razorpay_order_id: razorpayOrder.id,
      razorpay_key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: total_amount,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
