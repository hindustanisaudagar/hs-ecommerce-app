import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { colors, formatPrice, apiFetch, type Product, type ProductVariation } from '@hs/shared'
import { useCart, useWishlist } from '@hs/shared'
import { useEffect, useState } from 'react'
import { Heart, ShoppingBag, ChevronLeft, Star, Shield, Truck, RotateCcw } from 'lucide-react-native'

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null)
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()

  useEffect(() => {
    loadProduct()
  }, [slug])

  const loadProduct = async () => {
    try {
      const data = await apiFetch<Product>(`/products/${slug}`)
      setProduct(data)
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={colors.terracotta} />
      </View>
    )
  }

  if (!product) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-lg text-clay-brown">Product not found</Text>
      </View>
    )
  }

  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600']
  const variations = product.variations?.filter(v => v.is_active) || []

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View className="relative">
          <Image
            source={{ uri: images[selectedImage] }}
            className="w-full h-96"
            resizeMode="cover"
          />
          <TouchableOpacity className="absolute top-12 left-4 bg-white/90 rounded-full p-2" onPress={() => router.back()}>
            <ChevronLeft size={24} color={colors.ink} />
          </TouchableOpacity>
          {images.length > 1 && (
            <View className="flex-row justify-center -mt-4 gap-2">
              {images.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  className={`w-10 h-10 rounded-lg border-2 ${selectedImage === idx ? 'border-accent' : 'border-transparent'}`}
                  onPress={() => setSelectedImage(idx)}
                >
                  <Image source={{ uri: img }} className="w-full h-full rounded-lg" resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Product Info */}
        <View className="px-4 pt-4">
          {product.brand && (
            <Text className="text-xs text-clay-brown uppercase tracking-wider">{product.brand}</Text>
          )}
          <Text className="text-2xl font-serif text-ink mt-1">{product.name}</Text>
          
          {/* Price */}
          <View className="flex-row items-baseline mt-3 gap-2">
            <Text className="text-2xl font-bold text-accent">{formatPrice(product.price)}</Text>
            {product.original_price && (
              <Text className="text-base text-clay-brown line-through">{formatPrice(product.original_price)}</Text>
            )}
          </View>

          {/* Short Description */}
          {product.short_description && (
            <Text className="text-sm text-clay-brown mt-3 leading-6">{product.short_description}</Text>
          )}

          {/* Variations */}
          {variations.length > 0 && (
            <View className="mt-4">
              <Text className="text-sm font-medium text-ink mb-2">Variations</Text>
              <View className="flex-row gap-3">
                {variations.map((v) => (
                  <TouchableOpacity
                    key={v.id}
                    className={`px-4 py-2 rounded-full border ${selectedVariation === v.id ? 'bg-accent border-accent' : 'border-border'}`}
                    onPress={() => setSelectedVariation(v.id)}
                  >
                    <Text className={`text-sm ${selectedVariation === v.id ? 'text-white' : 'text-ink'}`}>
                      {v.color_name || v.sku}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <View className="mt-6">
              <Text className="text-base font-serif text-ink mb-2">Features</Text>
              {product.features.map((f, idx) => (
                <View key={idx} className="flex-row items-start mb-3 gap-3">
                  <View className="w-8 h-8 bg-secondary rounded-full items-center justify-center">
                    {f.icon_url ? (
                      <Image source={{ uri: f.icon_url }} className="w-5 h-5" resizeMode="contain" />
                    ) : (
                      <Star size={16} color={colors.accent} />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-ink">{f.title}</Text>
                    <Text className="text-xs text-clay-brown mt-1">{f.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Specifications */}
          {product.specifications && (
            <View className="mt-6 bg-secondary rounded-xl p-4">
              <Text className="text-base font-serif text-ink mb-3">Specifications</Text>
              {Object.entries(product.specifications).filter(([_, v]) => v).map(([key, val]) => (
                <View key={key} className="flex-row justify-between py-2 border-b border-border/50">
                  <Text className="text-xs text-clay-brown capitalize">{key.replace(/_/g, ' ')}</Text>
                  <Text className="text-xs text-ink font-medium">{val}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Description */}
          {product.description && (
            <View className="mt-6">
              <Text className="text-base font-serif text-ink mb-2">Description</Text>
              <Text className="text-sm text-clay-brown leading-6">{product.description}</Text>
            </View>
          )}

          {/* Trust Badges */}
          <View className="flex-row justify-around mt-8 mb-4 py-4 border-y border-border">
            <View className="items-center">
              <Truck size={22} color={colors.accent} />
              <Text className="text-xs text-clay-brown mt-1">Free Shipping</Text>
            </View>
            <View className="items-center">
              <Shield size={22} color={colors.accent} />
              <Text className="text-xs text-clay-brown mt-1">Premium Quality</Text>
            </View>
            <View className="items-center">
              <RotateCcw size={22} color={colors.accent} />
              <Text className="text-xs text-clay-brown mt-1">Easy Returns</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="bg-white border-t border-border px-4 py-3 flex-row items-center gap-3">
        <TouchableOpacity
          className="p-3 border border-border rounded-full"
          onPress={() => toggleItem(product.id)}
        >
          <Heart size={22} color={isInWishlist(product.id) ? colors.accent : colors.clayBrown} fill={isInWishlist(product.id) ? colors.accent : 'transparent'} />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-accent py-4 rounded-full items-center flex-row justify-center gap-2"
          onPress={() => addItem(product)}
        >
          <ShoppingBag size={20} color="white" />
          <Text className="text-white font-bold text-base">Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
