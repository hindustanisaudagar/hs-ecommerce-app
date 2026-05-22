import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors, formatPrice, useCart } from '@hs/shared'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react-native'

export default function CartScreen() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ShoppingBag size={64} color={colors.clayBrown} />
        <Text className="text-lg font-serif text-ink mt-4">Your cart is empty</Text>
        <Text className="text-sm text-clay-brown mt-2">Add some products to get started</Text>
        <TouchableOpacity className="mt-6 bg-accent px-8 py-3 rounded-full" onPress={() => router.push('/shop')}>
          <Text className="text-white font-medium">Browse Products</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 pt-2 pb-3 flex-row justify-between items-center">
        <Text className="text-2xl font-serif text-ink">Cart ({items.length})</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text className="text-accent text-sm">Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <View key={item.product.id} className="flex-row bg-white rounded-xl mb-3 p-3 border border-border">
            <Image
              source={{ uri: item.product.images?.[0] || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=200' }}
              className="w-20 h-20 rounded-lg"
              resizeMode="cover"
            />
            <View className="flex-1 ml-3">
              <Text className="text-sm font-medium text-ink" numberOfLines={2}>{item.product.name}</Text>
              <Text className="text-base font-bold text-accent mt-1">{formatPrice(item.product.price)}</Text>
              <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-center border border-border rounded-full">
                  <TouchableOpacity className="p-2" onPress={() => updateQuantity(item.product.id, item.quantity - 1)}>
                    <Minus size={16} color={colors.ink} />
                  </TouchableOpacity>
                  <Text className="px-4 font-medium">{item.quantity}</Text>
                  <TouchableOpacity className="p-2" onPress={() => updateQuantity(item.product.id, item.quantity + 1)}>
                    <Plus size={16} color={colors.ink} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.product.id)}>
                  <Trash2 size={18} color={colors.accent} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Total Bar */}
      <View className="bg-white border-t border-border px-4 py-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-base text-ink">Total</Text>
          <Text className="text-xl font-bold text-accent">{formatPrice(getTotalPrice())}</Text>
        </View>
        <TouchableOpacity
          className="bg-accent py-4 rounded-full items-center"
          onPress={() => router.push('/checkout')}
        >
          <Text className="text-white font-bold text-base">Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
