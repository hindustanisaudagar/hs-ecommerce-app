import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors, formatPrice, apiFetch, type Product } from '@hs/shared'
import { useCart, useWishlist } from '@hs/shared'
import { useEffect, useState } from 'react'
import { Heart, ShoppingBag, Filter, Search } from 'lucide-react-native'

export default function ShopScreen() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await apiFetch<{ products: Product[] }>(`/products${search ? `?search=${search}` : ''}`)
      setProducts(data.products || [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 pt-2 pb-3">
        <Text className="text-2xl font-serif text-ink">All Products</Text>
        <View className="flex-row items-center mt-3 bg-white rounded-full border border-border px-4">
          <Search size={18} color={colors.clayBrown} />
          <TextInput
            className="flex-1 py-3 px-3 text-ink"
            placeholder="Search products..."
            placeholderTextColor={colors.clayBrown}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={loadProducts}
          />
          <TouchableOpacity>
            <Filter size={18} color={colors.clayBrown} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.terracotta} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap px-2">
            {products.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="w-1/2 px-2 mb-4"
                onPress={() => router.push(`/product/${product.slug}`)}
              >
                <View className="bg-white rounded-xl" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
                  <Image
                    source={{ uri: product.images?.[0] || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400' }}
                    className="w-full h-48 rounded-t-xl"
                    resizeMode="cover"
                  />
                  <View className="p-3">
                    <Text className="text-sm font-medium text-ink" numberOfLines={1}>{product.name}</Text>
                    <Text className="text-lg font-bold text-accent mt-1">{formatPrice(product.price)}</Text>
                    {product.original_price && (
                      <Text className="text-xs text-clay-brown line-through">{formatPrice(product.original_price)}</Text>
                    )}
                    <View className="flex-row items-center mt-2 gap-2">
                      <TouchableOpacity
                        className="flex-1 bg-accent py-2 rounded-full items-center"
                        onPress={() => addItem(product)}
                      >
                        <ShoppingBag size={16} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="p-2 border border-border rounded-full"
                        onPress={() => toggleItem(product.id)}
                      >
                        <Heart size={18} color={isInWishlist(product.id) ? colors.accent : colors.clayBrown} fill={isInWishlist(product.id) ? colors.accent : 'transparent'} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
