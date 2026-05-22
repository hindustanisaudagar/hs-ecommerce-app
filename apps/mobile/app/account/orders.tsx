import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, formatPrice, formatDate, apiFetch, type Order } from '@hs/shared'
import { useEffect, useState } from 'react'
import { Package, ChevronRight } from 'lucide-react-native'

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const data = await apiFetch<Order[]>('/orders')
      setOrders(Array.isArray(data) ? data : [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<string, string> = {
    pending: '#C9A962',
    confirmed: '#B85A38',
    shipped: '#7D6B5D',
    delivered: '#1A1613',
    cancelled: '#B85A38',
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.terracotta} />
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Package size={64} color={colors.clayBrown} />
          <Text className="text-lg font-serif text-ink mt-4">No Orders Yet</Text>
          <Text className="text-sm text-clay-brown mt-2 text-center">Your orders will appear here</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {orders.map((order) => (
            <TouchableOpacity key={order.id} className="bg-white rounded-xl p-4 mb-3 border border-border">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <View className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[order.status] || colors.clayBrown }} />
                  <Text className="text-sm font-medium text-ink capitalize">{order.status}</Text>
                </View>
                <Text className="text-xs text-clay-brown">{formatDate(order.created_at)}</Text>
              </View>
              <View className="flex-row justify-between items-center mt-3">
                <Text className="text-lg font-bold text-accent">{formatPrice(order.total_amount)}</Text>
                <ChevronRight size={18} color={colors.clayBrown} />
              </View>
              {order.items && (
                <Text className="text-xs text-clay-brown mt-1">{order.items.length} item(s)</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
