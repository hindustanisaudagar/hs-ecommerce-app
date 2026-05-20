import { NextResponse } from 'next/server'
import { createBackend } from '@/lib/backend'
import { createClient } from '@/lib/supabase/server'
import { createRazorpayOrder } from '@/lib/razorpay'
import { createCashfreeOrder } from '@/lib/cashfree'
import { sendOrderConfirmationEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')

    const backend = await createBackend()

    if (orderId) {
      const data = await backend.getOrder(orderId, user.id)
      return NextResponse.json(data)
    }

    const data = await backend.getOrders(user.id)
    return NextResponse.json(data)
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

    let paymentData: any = {}

    if (payment_method === 'razorpay') {
      const razorpayOrder = await createRazorpayOrder(total_amount)
      paymentData = {
        razorpay_order_id: razorpayOrder.id,
        razorpay_key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: total_amount,
      }
    } else if (payment_method === 'cashfree') {
      const orderId = `order_${Date.now()}`
      const cashfreeOrder = await createCashfreeOrder(
        orderId,
        total_amount,
        shipping_address.name,
        shipping_address.email,
        shipping_address.phone
      )
      paymentData = {
        payment_session_id: cashfreeOrder.payment_session_id,
        order_id: orderId,
        amount: total_amount,
      }
    } else if (payment_method === 'cod') {
      paymentData = {
        amount: total_amount,
      }
    }

    const backend = await createBackend()

    const order = await backend.createOrder({
      items,
      shipping_address,
      billing_address,
      payment_method,
      user_id: user?.id,
    })

    return NextResponse.json({
      order,
      ...paymentData,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
