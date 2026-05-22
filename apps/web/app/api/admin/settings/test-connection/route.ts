import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { woocommerce_url, woocommerce_consumer_key, woocommerce_consumer_secret } = body
    
    if (!woocommerce_url || !woocommerce_consumer_key || !woocommerce_consumer_secret) {
      return NextResponse.json({ 
        success: false, 
        message: 'All fields are required' 
      }, { status: 400 })
    }
    
    const baseUrl = woocommerce_url.replace(/\/$/, '')
    
    const response = await axios.get(`${baseUrl}/wp-json/wc/v3/products`, {
      params: { per_page: 1 },
      auth: {
        username: woocommerce_consumer_key,
        password: woocommerce_consumer_secret,
      },
      timeout: 10000,
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Connected successfully!',
      products_count: response.data?.length || 0
    })
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Connection failed'
    return NextResponse.json({ 
      success: false, 
      message 
    }, { status: 400 })
  }
}
