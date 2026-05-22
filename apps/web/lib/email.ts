import { Resend } from 'resend'

let resendInstance: Resend | null = null

function getResend() {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY || '')
  }
  return resendInstance
}

export async function sendOrderConfirmationEmail(
  email: string,
  order: {
    id: string
    total_amount: number
    items: Array<{
      product: { name: string }
      quantity: number
      price: number
    }>
  }
) {
  try {
    const resend = getResend()
    await resend.emails.send({
      from: 'Hindustani Saudagar <onboarding@resend.dev>',
      to: email,
      subject: `Order Confirmed - #${order.id.slice(0, 8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #B85A38;">Thank you for your order!</h1>
          <p>Order ID: ${order.id.slice(0, 8)}</p>
          <p>Total Amount: ₹${order.total_amount.toLocaleString('en-IN')}</p>
          
          <h2>Order Details:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          
          <p style="margin-top: 20px; color: #666;">
            We'll notify you once your order is shipped.
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}
