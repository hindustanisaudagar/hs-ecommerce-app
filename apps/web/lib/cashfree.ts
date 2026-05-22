import axios from 'axios'

const CASHFREE_BASE_URL = 'https://sandbox.cashfree.com/pg'

export async function createCashfreeOrder(orderId: string, amount: number, customerName: string, customerEmail: string, customerPhone: string) {
  try {
    const response = await axios.post(
      `${CASHFREE_BASE_URL}/orders`,
      {
        order_id: orderId,
        order_amount: amount,
        order_currency: 'INR',
        customer_details: {
          customer_id: orderId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-version': '2023-08-01',
          'x-client-id': process.env.CASHFREE_APP_ID,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        },
      }
    )

    return response.data
  } catch (error: any) {
    console.error('Cashfree order creation failed:', error.response?.data || error.message)
    throw new Error(error.response?.data?.message || 'Failed to create Cashfree order')
  }
}

export async function verifyCashfreePayment(orderId: string) {
  try {
    const response = await axios.get(
      `${CASHFREE_BASE_URL}/orders/${orderId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-version': '2023-08-01',
          'x-client-id': process.env.CASHFREE_APP_ID,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        },
      }
    )

    return response.data
  } catch (error: any) {
    console.error('Cashfree payment verification failed:', error.response?.data || error.message)
    throw new Error(error.response?.data?.message || 'Failed to verify Cashfree payment')
  }
}
