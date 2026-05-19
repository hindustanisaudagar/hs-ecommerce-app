'use client'

import { useState, useEffect } from 'react'
import { Package, ShoppingCart, IndianRupee, TrendingUp } from 'lucide-react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStock: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const productsRes = await fetch('/api/products?limit=1')
      const productsData = await productsRes.json()

      setStats({
        totalProducts: productsData.total || 0,
        totalOrders: 0,
        totalRevenue: 0,
        lowStock: 0,
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-terracotta',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-clay-brown',
    },
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'bg-gold',
    },
    {
      label: 'Low Stock Items',
      value: stats.lowStock,
      icon: TrendingUp,
      color: 'bg-ink',
    },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink mb-8">Dashboard</h1>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading stats...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="bg-cream rounded-2xl p-6 shadow-premium"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-cream" />
                  </div>
                </div>
                <p className="text-2xl font-light text-ink">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            )
          })}
        </div>
      )}

      <div className="bg-cream rounded-2xl p-8 shadow-premium">
        <h2 className="font-serif text-xl text-ink mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/products/new"
            className="p-4 border border-border/50 rounded-xl text-center hover:bg-warm-beige transition-colors"
          >
            <Package className="w-6 h-6 mx-auto mb-2 text-terracotta" />
            <p className="text-sm text-ink">Add Product</p>
          </a>
          <a
            href="/admin/products"
            className="p-4 border border-border/50 rounded-xl text-center hover:bg-warm-beige transition-colors"
          >
            <Package className="w-6 h-6 mx-auto mb-2 text-clay-brown" />
            <p className="text-sm text-ink">Manage Products</p>
          </a>
          <a
            href="/admin/orders"
            className="p-4 border border-border/50 rounded-xl text-center hover:bg-warm-beige transition-colors"
          >
            <ShoppingCart className="w-6 h-6 mx-auto mb-2 text-gold" />
            <p className="text-sm text-ink">View Orders</p>
          </a>
          <a
            href="/admin/categories"
            className="p-4 border border-border/50 rounded-xl text-center hover:bg-warm-beige transition-colors"
          >
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-ink" />
            <p className="text-sm text-ink">Categories</p>
          </a>
        </div>
      </div>
    </div>
  )
}
