import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors, formatPrice, supabase, useWishlist, useCart } from '@hs/shared'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { type Product } from '@hs/shared'

export default function WishlistScreen() {
  const router = useRouter()
  const { items, removeItem } = useWishlist()
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (items.length > 0) {
      loadWishlistedProducts()
    }
  }, [items])

  const loadWishlistedProducts = async () => {
    try {
      const ids = items.map(i => i.productId)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', ids)
      if (data) setProducts(data as Product[])
    } catch {
      setProducts([])
    }
  }

  if (items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <Heart size={64} color={colors.clayBrown} />
        <Text className="text-lg font-serif text-ink mt-4">Wishlist is empty</Text>
        <Text className="text-sm text-clay-brown mt-2">Save products you love</Text>
        <TouchableOpacity className="mt-6 bg-accent px-8 py-3 rounded-full" onPress={() => router.push('/shop')}>
          <Text className="text-white font-medium">Browse Products</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 pt-2 pb-3">
        <Text className="text-2xl font-serif text-ink">Wishlist ({items.length})</Text>
      </View>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {items.map((item) => {
          const product = products.find(p => p.id === item.productId)
          if (!product) return null
          return (
            <TouchableOpacity
              key={item.productId}
              className="flex-row bg-white rounded-xl mb-3 p-3 border border-border"
              onPress={() => router.push(`/product/${product.slug}`)}
            >
              <Image
                source={{ uri: product.images?.[0] || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=200' }}
                className="w-20 h-20 rounded-lg"
                resizeMode="cover"
              />
              <View className="flex-1 ml-3">
                <Text className="text-sm font-medium text-ink" numberOfLines={2}>{product.name}</Text>
                <Text className="text-base font-bold text-accent mt-1">{formatPrice(product.price)}</Text>
                <View className="flex-row items-center mt-2 gap-2">
                  <TouchableOpacity
                    className="bg-accent py-2 px-4 rounded-full flex-row items-center gap-1"
                    onPress={() => { addItem(product); removeItem(product.id) }}
                  >
                    <ShoppingBag size={14} color="white" />
                    <Text className="text-white text-xs">Move to Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeItem(item.productId)}>
                    <Trash2 size={18} color={colors.accent} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}
