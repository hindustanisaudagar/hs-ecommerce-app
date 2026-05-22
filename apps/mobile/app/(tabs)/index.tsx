import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors, formatPrice, apiFetch, type Product, type Category } from '@hs/shared'
import { useEffect, useState } from 'react'
import { useCart, useWishlist } from '@hs/shared'
import { Heart, ShoppingBag, Star, ChevronRight } from 'lucide-react-native'

const categories: { name: string; image: string; slug: string }[] = [
  { name: 'Ceramic Diffusers', image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=200', slug: 'ceramic-diffusers' },
  { name: 'Handmade Mugs', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200', slug: 'handmade-mugs' },
  { name: 'Planters', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200', slug: 'planters' },
  { name: 'Decorative Vases', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=200', slug: 'decorative-vases' },
  { name: 'Terracotta', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200', slug: 'terracotta' },
  { name: 'Dinner Sets', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200', slug: 'dinner-sets' },
]

export default function HomeScreen() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await apiFetch<{ products: Product[] }>('/products?limit=10')
      setProducts(data.products || [])
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <TouchableOpacity
      className="flex-1 mx-2 mb-4 bg-white rounded-xl shadow-premium"
      onPress={() => router.push(`/product/${product.slug}`)}
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}
    >
      <Image
        source={{ uri: product.images?.[0] || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400' }}
        className="w-full h-48 rounded-t-xl"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="text-sm font-sans text-ink font-medium" numberOfLines={1}>{product.name}</Text>
        <Text className="text-lg font-bold text-accent mt-1">{formatPrice(product.price)}</Text>
        {product.original_price && (
          <Text className="text-xs text-clay-brown line-through">{formatPrice(product.original_price)}</Text>
        )}
        <View className="flex-row items-center mt-2">
          <TouchableOpacity
            className="flex-1 bg-accent py-2 rounded-full mr-2 items-center"
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
    </TouchableOpacity>
  )

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-xs text-clay-brown font-hindi">हस्तनिर्मित · देश की मिट्टी</Text>
          <Text className="text-3xl font-serif text-ink mt-1">Hindustani</Text>
          <Text className="text-3xl font-serif text-ink -mt-2">Saudagar</Text>
        </View>

        {/* Hero Banner */}
        <View className="mx-4 mb-6 h-56 bg-ink rounded-2xl overflow-hidden">
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800' }}
            className="w-full h-full opacity-60"
            resizeMode="cover"
          />
          <View className="absolute inset-0 justify-center items-center px-6">
            <Text className="text-white text-2xl font-serif text-center">Handcrafted Ceramics</Text>
            <Text className="text-white/80 text-sm text-center mt-2">From the heart of India</Text>
            <TouchableOpacity className="mt-4 bg-accent px-6 py-3 rounded-full" onPress={() => router.push('/shop')}>
              <Text className="text-white font-medium">Shop Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center px-4 mb-3">
            <Text className="text-lg font-serif text-ink">Categories</Text>
            <TouchableOpacity onPress={() => router.push('/shop')}>
              <Text className="text-accent text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.slug}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity className="items-center" onPress={() => router.push(`/shop?category=${item.slug}`)}>
                <Image source={{ uri: item.image }} className="w-20 h-20 rounded-full" resizeMode="cover" />
                <Text className="text-xs text-ink mt-2 text-center w-20" numberOfLines={2}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Bestsellers */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center px-4 mb-3">
            <Text className="text-lg font-serif text-ink">Bestsellers</Text>
            <TouchableOpacity onPress={() => router.push('/shop')}>
              <Text className="text-accent text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <View className="px-4">
              <Text className="text-clay-brown">Loading...</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap px-2">
              {products.slice(0, 4).map((product) => (
                <View key={product.id} style={{ width: '50%' }}>
                  <ProductCard product={product} />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Brand Story */}
        <View className="mx-4 mb-6 bg-secondary rounded-2xl p-6">
          <Text className="text-lg font-serif text-ink mb-2">Our Story</Text>
          <Text className="text-sm text-clay-brown leading-6">
            Each piece of ceramic tells a story of tradition, craftsmanship, and the quiet hands of India's artisans.
          </Text>
          <TouchableOpacity className="mt-3">
            <Text className="text-accent font-medium">Read More →</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="bg-ink px-6 py-8 mt-4">
          <Text className="text-cream text-2xl font-serif text-center">Hindustani Saudagar</Text>
          <Text className="text-cream/60 text-xs text-center mt-2 font-hindi">हस्तनिर्मित · देश की मिट्टी</Text>
          <Text className="text-cream/40 text-xs text-center mt-6">© 2025 Hindustani Saudagar. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
