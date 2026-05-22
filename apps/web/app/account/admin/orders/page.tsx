'use client'

import { useState, useEffect } from 'react'
import { Order } from '@/types'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      fetchOrders()
    } catch (error) {
      console.error('Failed to update order:', error)
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink mb-8">Orders</h1>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-cream rounded-2xl">
          <p className="text-muted-foreground">No orders yet</p>
        </div>
      ) : (
        <div className="bg-cream rounded-2xl overflow-hidden shadow-premium">
          <table className="w-full">
            <thead className="bg-warm-beige/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Order ID
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Total
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-warm-beige/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink">
                      #{order.id.slice(0, 8)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-ink">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink">
                      ₹{order.total_amount.toLocaleString('en-IN')}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="px-3 py-1 rounded-full text-xs bg-warm-beige border border-border/50 text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-terracotta hover:underline">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
