import { WooCommerceClient } from './client'
import { Order, OrderInput } from '@/types'

function mapWooOrderToInternal(wooOrder: any): Order {
  const metaData = wooOrder.meta_data || []
  const getMeta = (key: string) => metaData.find((m: any) => m.key === key)?.value || null
  
  return {
    id: wooOrder.id.toString(),
    user_id: wooOrder.customer_id?.toString() || '',
    total_amount: parseFloat(wooOrder.total) || 0,
    status: wooOrder.status,
    shipping_address: wooOrder.shipping || {},
    billing_address: wooOrder.billing || {},
    payment_method: wooOrder.payment_method,
    razorpay_order_id: getMeta('razorpay_order_id'),
    razorpay_payment_id: getMeta('razorpay_payment_id'),
    created_at: wooOrder.date_created,
    items: wooOrder.line_items?.map((item: any) => ({
      id: item.id.toString(),
      order_id: wooOrder.id.toString(),
      product_id: item.product_id.toString(),
      variation_id: item.variation_id?.toString(),
      quantity: item.quantity,
      price: parseFloat(item.price) || 0,
    })),
  }
}

export function createWooCommerceOrders(client: WooCommerceClient) {
  return {
    async getOrders(userId?: string): Promise<Order[]> {
      const params: any = {
        per_page: 100,
        orderby: 'date',
        order: 'desc',
      }
      
      if (userId) params.customer = parseInt(userId)
      
      const orders = await client.get('orders', params)
      return orders.map(mapWooOrderToInternal)
    },
    
    async getOrder(id: string, userId?: string): Promise<Order> {
      const order = await client.get(`orders/${id}`)
      
      if (userId && order.customer_id?.toString() !== userId) {
        throw new Error('Order not found')
      }
      
      return mapWooOrderToInternal(order)
    },
    
    async createOrder(data: OrderInput): Promise<Order> {
      const wooOrder = {
        payment_method: data.payment_method,
        payment_method_title: data.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment',
        set_paid: data.payment_method === 'cod',
        billing: {
          first_name: data.billing_address?.name?.split(' ')[0] || '',
          last_name: data.billing_address?.name?.split(' ').slice(1).join(' ') || '',
          email: data.billing_address?.email || '',
          phone: data.billing_address?.phone || '',
          address_1: data.billing_address?.address_line1 || '',
          address_2: data.billing_address?.address_line2 || '',
          city: data.billing_address?.city || '',
          state: data.billing_address?.state || '',
          postcode: data.billing_address?.pincode || '',
          country: data.billing_address?.country || 'IN',
        },
        shipping: {
          first_name: data.shipping_address?.name?.split(' ')[0] || '',
          last_name: data.shipping_address?.name?.split(' ').slice(1).join(' ') || '',
          phone: data.shipping_address?.phone || '',
          address_1: data.shipping_address?.address_line1 || '',
          address_2: data.shipping_address?.address_line2 || '',
          city: data.shipping_address?.city || '',
          state: data.shipping_address?.state || '',
          postcode: data.shipping_address?.pincode || '',
          country: data.shipping_address?.country || 'IN',
        },
        line_items: data.items.map((item) => ({
          product_id: parseInt(item.product_id),
          variation_id: item.variation_id ? parseInt(item.variation_id) : undefined,
          quantity: item.quantity,
        })),
        meta_data: data.razorpay_order_id ? [
          { key: 'razorpay_order_id', value: data.razorpay_order_id },
        ] : [],
      }
      
      const created = await client.post('orders', wooOrder)
      return mapWooOrderToInternal(created)
    },
    
    async updateOrderStatus(id: string, status: string): Promise<Order> {
      const updated = await client.put(`orders/${id}`, { status })
      return mapWooOrderToInternal(updated)
    },
  }
}
