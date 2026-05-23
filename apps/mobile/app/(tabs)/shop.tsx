import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { colors, formatPrice, supabase, type Product } from '@hs/shared'
import { useCart, useWishlist } from '@hs/shared'
import { useEffect, useState } from 'react'
import { Heart, ShoppingBag, Filter, Search, X, Check } from 'lucide-react-native'

const filterCategories = [
  { name: 'All Products', slug: 'all' },
  { name: 'Ceramic Diffusers', slug: 'ceramic-diffusers' },
  { name: 'Handmade Mugs', slug: 'handmade-mugs' },
  { name: 'Planters', slug: 'planters' },
  { name: 'Decorative Vases', slug: 'decorative-vases' },
  { name: 'Terracotta', slug: 'terracotta' },
  { name: 'Dinner Sets', slug: 'dinner-sets' },
]

const sortOptions = [
  { name: 'Featured / Default', value: 'default' },
  { name: 'Price: Low to High', value: 'price_low_high' },
  { name: 'Price: High to Low', value: 'price_high_low' },
]

const priceBudgets = [
  { label: 'Under ₹500', value: '500' },
  { label: 'Under ₹1,000', value: '1000' },
  { label: 'Under ₹2,000', value: '2000' },
  { label: 'Any Price', value: '' },
]

export default function ShopScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ category?: string, search?: string }>()
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  // Filter States
  const [isFilterVisible, setIsFilterVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('default')
  const [maxPrice, setMaxPrice] = useState<string>('')
  
  // Temporary Filter States (for editing inside the modal)
  const [tempCategory, setTempCategory] = useState<string>('all')
  const [tempSortBy, setTempSortBy] = useState<string>('default')
  const [tempMaxPrice, setTempMaxPrice] = useState<string>('')

  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()

  // Initialize and load filters from URL search params
  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category)
      setTempCategory(params.category)
    } else {
      setSelectedCategory('all')
      setTempCategory('all')
    }
    if (params.search) {
      setSearch(params.search)
    }
    loadProducts()
  }, [params.category, params.search])

  const loadProducts = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('products')
        .select('*, category:categories(name, slug)')
        .eq('is_active', true)
      if (search) {
        query = query.ilike('name', `%${search}%`)
      }
      const { data, error } = await query.order('created_at', { ascending: false })
      if (data) setProducts(data as Product[])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Active filters count
  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) + 
    (sortBy !== 'default' ? 1 : 0) + 
    (maxPrice ? 1 : 0)

  // Filter & Sort Logic on Client Side
  const filteredProducts = products
    .filter((product) => {
      // 1. Category Filter
      if (selectedCategory !== 'all') {
        const matchesCategory = 
          product.category?.slug === selectedCategory || 
          product.category?.name?.toLowerCase() === selectedCategory.toLowerCase() ||
          product.category_id === selectedCategory;
        if (!matchesCategory) return false;
      }
      // 2. Price Filter
      if (maxPrice && parseFloat(maxPrice) > 0) {
        if (product.price > parseFloat(maxPrice)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low_high') {
        return a.price - b.price;
      }
      if (sortBy === 'price_high_low') {
        return b.price - a.price;
      }
      return 0; // Default featured sort
    })

  const openFilterModal = () => {
    setTempCategory(selectedCategory)
    setTempSortBy(sortBy)
    setTempMaxPrice(maxPrice)
    setIsFilterVisible(true)
  }

  const applyFilters = () => {
    setSelectedCategory(tempCategory)
    setSortBy(tempSortBy)
    setMaxPrice(tempMaxPrice)
    setIsFilterVisible(false)
  }

  const resetFilters = () => {
    setTempCategory('all')
    setTempSortBy('default')
    setTempMaxPrice('')
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top Search & Filter Bar */}
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
          <TouchableOpacity 
            className="flex-row items-center gap-1 py-2 pl-3" 
            onPress={openFilterModal}
          >
            <Filter size={18} color={activeFiltersCount > 0 ? colors.accent : colors.clayBrown} />
            {activeFiltersCount > 0 && (
              <View className="bg-accent rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-[10px] font-bold">{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Selected Filter Tags indicator */}
        {activeFiltersCount > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mt-2 gap-2">
            {selectedCategory !== 'all' && (
              <View className="flex-row items-center bg-secondary px-3 py-1.5 rounded-full border border-border">
                <Text className="text-xs text-ink mr-1 font-medium capitalize">
                  {selectedCategory.replace('-', ' ')}
                </Text>
                <TouchableOpacity onPress={() => setSelectedCategory('all')}>
                  <X size={12} color={colors.ink} />
                </TouchableOpacity>
              </View>
            )}
            {sortBy !== 'default' && (
              <View className="flex-row items-center bg-secondary px-3 py-1.5 rounded-full border border-border">
                <Text className="text-xs text-ink mr-1 font-medium">
                  {sortBy === 'price_low_high' ? 'Price: Low to High' : 'Price: High to Low'}
                </Text>
                <TouchableOpacity onPress={() => setSortBy('default')}>
                  <X size={12} color={colors.ink} />
                </TouchableOpacity>
              </View>
            )}
            {maxPrice && (
              <View className="flex-row items-center bg-secondary px-3 py-1.5 rounded-full border border-border">
                <Text className="text-xs text-ink mr-1 font-medium">Under ₹{maxPrice}</Text>
                <TouchableOpacity onPress={() => setMaxPrice('')}>
                  <X size={12} color={colors.ink} />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Product List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.terracotta} />
        </View>
      ) : filteredProducts.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-lg font-serif text-ink text-center">No products found</Text>
          <Text className="text-sm text-clay-brown text-center mt-2">
            Try modifying your search or reset filters to see all beautiful handcrafts.
          </Text>
          <TouchableOpacity 
            className="mt-6 bg-accent px-6 py-3 rounded-full" 
            onPress={() => {
              setSearch('');
              setSelectedCategory('all');
              setSortBy('default');
              setMaxPrice('');
              loadProducts();
            }}
          >
            <Text className="text-white font-medium">Reset All</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap px-2">
            {filteredProducts.map((product) => (
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
                    <Text className="text-sm font-medium text-ink font-sans" numberOfLines={1}>{product.name}</Text>
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

      {/* Advanced Filter Modal (Slide-up Bottom Sheet) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterVisible}
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-background rounded-t-3xl p-6" style={{ maxHeight: '80%' }}>
            {/* Header */}
            <View className="flex-row justify-between items-center pb-4 border-b border-border/50">
              <Text className="text-xl font-serif text-ink">Filters & Sort</Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <X size={20} color={colors.ink} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
              {/* Sort Section */}
              <View className="mb-6">
                <Text className="text-sm font-bold text-ink uppercase tracking-wider mb-3">Sort By</Text>
                <View className="gap-2">
                  {sortOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      className={`flex-row items-center justify-between p-3 rounded-xl border ${
                        tempSortBy === opt.value ? 'bg-secondary border-accent' : 'bg-white border-border/50'
                      }`}
                      onPress={() => setTempSortBy(opt.value)}
                    >
                      <Text className={`text-sm ${tempSortBy === opt.value ? 'font-bold text-accent' : 'text-ink'}`}>
                        {opt.name}
                      </Text>
                      {tempSortBy === opt.value && <Check size={16} color={colors.accent} />}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Categories Section */}
              <View className="mb-6">
                <Text className="text-sm font-bold text-ink uppercase tracking-wider mb-3">Category</Text>
                <View className="flex-row flex-wrap gap-2">
                  {filterCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat.slug}
                      className={`px-4 py-2.5 rounded-full border ${
                        tempCategory === cat.slug ? 'bg-accent border-accent' : 'bg-white border-border'
                      }`}
                      onPress={() => setTempCategory(cat.slug)}
                    >
                      <Text className={`text-xs ${tempCategory === cat.slug ? 'text-white font-bold' : 'text-ink'}`}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price Budget Section */}
              <View className="mb-8">
                <Text className="text-sm font-bold text-ink uppercase tracking-wider mb-3">Price Budget</Text>
                <View className="flex-row flex-wrap gap-2 mb-3">
                  {priceBudgets.map((budget) => (
                    <TouchableOpacity
                      key={budget.value}
                      className={`flex-1 min-w-[45%] p-3 items-center rounded-xl border ${
                        tempMaxPrice === budget.value ? 'bg-secondary border-accent' : 'bg-white border-border'
                      }`}
                      onPress={() => setTempMaxPrice(budget.value)}
                    >
                      <Text className={`text-xs ${tempMaxPrice === budget.value ? 'font-bold text-accent' : 'text-ink'}`}>
                        {budget.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View className="flex-row items-center bg-white border border-border rounded-xl px-4 py-1.5 mt-2">
                  <Text className="text-ink text-sm font-medium mr-2">Custom Max Price: ₹</Text>
                  <TextInput
                    className="flex-1 py-2 text-ink text-sm"
                    placeholder="Enter maximum price"
                    placeholderTextColor={colors.clayBrown}
                    keyboardType="numeric"
                    value={tempMaxPrice}
                    onChangeText={setTempMaxPrice}
                  />
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="flex-row gap-3 pt-4 border-t border-border/50">
              <TouchableOpacity
                className="flex-1 py-4 bg-white border border-border rounded-full items-center"
                onPress={resetFilters}
              >
                <Text className="text-clay-brown font-bold text-sm">Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-4 bg-accent rounded-full items-center"
                onPress={applyFilters}
              >
                <Text className="text-white font-bold text-sm">Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

