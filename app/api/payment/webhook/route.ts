import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyPayment } from '@/lib/razorpay'
import { sendOrderConfirmationEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body

    const isValid = await verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update({
        status: 'processing',
        razorpay_payment_id,
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select('*, items:order_items(product:products(name, images), quantity, price)')
      .single()

    if (orderError) throw orderError

    if (order?.user_id) {
      const { data: userData } = await supabase
        .from('users')
        .select('email')
        .eq('id', order.user_id)
        .single()

      if (userData?.email) {
        await sendOrderConfirmationEmail(userData.email, {
          id: order.id,
          total_amount: order.total_amount,
          items: order.items || [],
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
