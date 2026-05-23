import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors, formatPrice, supabase, type Product } from '@hs/shared'
import { useEffect, useState, useRef } from 'react'
import { useCart, useWishlist } from '@hs/shared'
import { Heart, ShoppingBag, Star, ChevronRight, MapPin, Search, Bell, Tag, Sparkles } from 'lucide-react-native'

interface SubCategory {
  name: string;
  slug: string;
  image: string;
}

interface MainCategory {
  name: string;
  slug: string;
  image: string;
  subcategories: SubCategory[];
}

const customCategories: MainCategory[] = [
  {
    name: 'Dining',
    slug: 'dining',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861affa?w=300&q=80',
    subcategories: [
      { name: 'Coffee Mugs', slug: 'coffee-mugs', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200&q=80' },
      { name: 'Dinner Sets', slug: 'dinner-sets', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80' },
      { name: 'Kullads', slug: 'kullads', image: 'https://images.unsplash.com/photo-1568644391225-44f2b5959af1?w=200&q=80' },
      { name: 'Bowls', slug: 'bowls', image: 'https://images.unsplash.com/photo-1576016770956-debb63d90029?w=200&q=80' },
      { name: 'Trays', slug: 'trays', image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=200&q=80' },
      { name: 'Plates & Platters', slug: 'plates-platters', image: 'https://images.unsplash.com/photo-1601598851547-430296cbd361?w=200&q=80' },
      { name: 'Beer Mugs', slug: 'beer-mugs', image: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=200&q=80' },
      { name: 'Chopping Boards', slug: 'chopping-boards', image: 'https://images.unsplash.com/photo-1594911774802-8822a707cbb3?w=200&q=80' },
      { name: 'Coasters', slug: 'coasters', image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=200&q=80' },
      { name: 'Cup & Coasters', slug: 'cup-coasters', image: 'https://images.unsplash.com/photo-1616047006787-b844b234d88f?w=200&q=80' },
      { name: 'Cutlery Holders', slug: 'cutlery-holders', image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=200&q=80' },
      { name: 'Drinkware', slug: 'drinkware', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200&q=80' },
      { name: 'Jars & Containers', slug: 'jars-containers', image: 'https://images.unsplash.com/photo-1536622432307-20c5286441f6?w=200&q=80' },
      { name: 'Kettle & Cups', slug: 'kettle-cups', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&q=80' },
      { name: 'Napkin Holders', slug: 'napkin-holders', image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=200&q=80' },
      { name: 'Salt & Pepper', slug: 'salt-pepper-shakers', image: 'https://images.unsplash.com/photo-1535401991746-da3d9055713e?w=200&q=80' },
      { name: 'Serveware', slug: 'serveware', image: 'https://images.unsplash.com/photo-1535401991746-da3d9055713e?w=200&q=80' },
      { name: 'Spice Boxes', slug: 'spice-boxes', image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=200&q=80' },
      { name: 'Storage', slug: 'storage', image: 'https://images.unsplash.com/photo-1536622432307-20c5286441f6?w=200&q=80' },
      { name: 'Tableware', slug: 'tableware', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80' },
      { name: 'Tea Cups', slug: 'tea-cups', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&q=80' },
      { name: 'Toothpick Holders', slug: 'toothpick-holders', image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=200&q=80' }
    ]
  },
  {
    name: 'Decor',
    slug: 'decor',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=300&q=80',
    subcategories: [
      { name: 'Ceramic Vases', slug: 'ceramic-vases', image: 'https://images.unsplash.com/photo-1581781870027-04212e231e96?w=200&q=80' },
      { name: 'Wall Decor', slug: 'wall-decor', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&q=80' },
      { name: 'Wall Shelves', slug: 'wall-shelves', image: 'https://images.unsplash.com/photo-1594235048970-13f569947f63?w=200&q=80' },
      { name: 'Key Holders', slug: 'key-holders', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=200&q=80' },
      { name: 'Metal Vases', slug: 'metal-vases', image: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=200&q=80' },
      { name: 'Wall Clocks', slug: 'wall-clocks', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdcd1d?w=200&q=80' },
      { name: 'Wall Hangings', slug: 'wall-hangings', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&q=80' }
    ]
  },
  {
    name: 'Lighting',
    slug: 'lamps-lighting',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80',
    subcategories: [
      { name: 'Table Lamps', slug: 'table-lamps', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&q=80' },
      { name: 'Candle Holders', slug: 'candle-holders', image: 'https://images.unsplash.com/photo-1603006905393-0d5b7a10faad?w=200&q=80' }
    ]
  },
  {
    name: 'Fragrances',
    slug: 'home-fragrances',
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=300&q=80',
    subcategories: [
      { name: 'Candle Diffusers', slug: 'candle-diffusers', image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=200&q=80' },
      { name: 'Electric Diffusers', slug: 'electric-diffusers', image: 'https://images.unsplash.com/photo-1519183071298-a2962feb14f4?w=200&q=80' },
      { name: 'Essential Oils', slug: 'essential-oils', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&q=80' }
    ]
  },
  {
    name: 'Bath',
    slug: 'bath-essentials',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=300&q=80',
    subcategories: []
  },
  {
    name: 'Garden',
    slug: 'garden',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&q=80',
    subcategories: []
  },
  {
    name: 'Gifting',
    slug: 'gifting',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=80',
    subcategories: []
  },
  {
    name: 'Studio Art',
    slug: 'studio-art',
    image: 'https://images.unsplash.com/photo-1565192647048-f997eed87981?w=300&q=80',
    subcategories: []
  },
  {
    name: 'Sale',
    slug: 'sale',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=80',
    subcategories: []
  }
]

const banners = [
  {
    id: 1,
    title: 'The Royal Dining Collection',
    subtitle: 'Elevate your feast with heritage pottery.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861affa?w=800&q=80',
    category: 'dining'
  },
  {
    id: 2,
    title: 'Artisan Lightscapes',
    subtitle: 'Ceramic table lamps of divine radiance.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    category: 'lamps-lighting'
  },
  {
    id: 3,
    title: 'Studio Clay Wonders',
    subtitle: 'Authentic 100% lead-free clay cookware.',
    image: 'https://images.unsplash.com/photo-1565192647048-f997eed87981?w=800&q=80',
    category: 'studio-art'
  }
]

const potteryClusters = [
  {
    id: 'khurja',
    name: 'Khurja Pottery',
    location: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&q=80',
    description: 'Traditional Mughal hand-painted cobalt glaze work.'
  },
  {
    id: 'jaipur',
    name: 'Jaipur Blue',
    location: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=300&q=80',
    description: 'Cobalt-blue floral masterpieces crafted without clay.'
  },
  {
    id: 'nizamabad',
    name: 'Nizamabad Black',
    location: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1565192647048-f997eed87981?w=300&q=80',
    description: 'Glossy dark clay-baked structures etched with silver zinc alloy.'
  },
  {
    id: 'chunar',
    name: 'Chunar Clay',
    location: 'Mirzapur',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80',
    description: 'Authentic organic red clay fired in traditional wood kilns.'
  }
]

const trustBadges = [
  { icon: '🛡️', title: '100% Lead-Free', subtitle: 'Food-safe tested' },
  { icon: '🌿', title: 'Empowering Potters', subtitle: 'Supporting rural homes' },
  { icon: '📦', title: 'Shockproof Transit', subtitle: 'Zero breakage pledge' }
]

export default function HomeScreen() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('ALL')
  const [activeBannerIndex, setActiveBannerIndex] = useState(0)
  
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  
  const carouselRef = useRef<FlatList>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  // Auto-scroll hero banner every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (activeBannerIndex + 1) % banners.length
      setActiveBannerIndex(nextIndex)
      carouselRef.current?.scrollToIndex({ index: nextIndex, animated: true })
    }, 5000)
    return () => clearInterval(timer)
  }, [activeBannerIndex])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(name, slug)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20)
      if (data) setProducts(data as Product[])
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }

  // Filter products locally for instantaneous response
  const filteredProducts = selectedTab === 'ALL'
    ? products
    : products.filter(p => {
        const catSlug = p.category?.slug?.toLowerCase()
        const catName = p.category?.name?.toLowerCase()
        const searchSlug = selectedTab.toLowerCase()
        return catSlug === searchSlug || catName === searchSlug
      })

  // Dynamic Circles: if ALL, show Main categories. If specific tab, show its subcategories.
  const activeCategory = customCategories.find(c => c.slug === selectedTab)
  const displayCircles = selectedTab === 'ALL'
    ? customCategories.map(c => ({ name: c.name, slug: c.slug, image: c.image, isSub: false }))
    : activeCategory?.subcategories.map(s => ({ name: s.name, slug: s.slug, image: s.image, isSub: true })) || []

  // Fallback circle if a category has no subcategories (e.g. Bath, Garden)
  const circlesData = displayCircles.length > 0 
    ? displayCircles 
    : [
        { 
          name: `Explore All ${activeCategory?.name || ''}`, 
          slug: selectedTab, 
          image: activeCategory?.image || 'https://images.unsplash.com/photo-1610701596007-11502861affa?w=300&q=80', 
          isSub: false 
        }
      ]

  const handleCategoryPress = (item: { name: string; slug: string; isSub: boolean }) => {
    if (item.isSub) {
      // If it is a subcategory circle, redirect to shop with it filtered
      router.push(`/shop?category=${item.slug}`)
    } else {
      // If it is a main category circle on the 'ALL' tab, switch selected tab to that category
      const targetMain = customCategories.find(c => c.slug === item.slug)
      if (targetMain) {
        setSelectedTab(targetMain.slug)
      } else {
        router.push(`/shop?category=${item.slug}`)
      }
    }
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <TouchableOpacity
      className="flex-1 mx-2 mb-4 bg-white rounded-xl overflow-hidden shadow-premium border border-border/40"
      onPress={() => router.push(`/product/${product.slug}`)}
      style={{ shadowColor: '#1A1613', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 4 }}
    >
      <View className="relative">
        <Image
          source={{ uri: product.images?.[0] || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400' }}
          className="w-full h-48"
          resizeMode="cover"
        />
        {product.original_price && product.price < product.original_price && (
          <View className="absolute top-2 left-2 bg-accent px-2 py-0.5 rounded-md">
            <Text className="text-[10px] font-sans font-bold text-white uppercase">
              {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
            </Text>
          </View>
        )}
      </View>
      <View className="p-3">
        <Text className="text-[10px] text-clay-brown font-semibold uppercase tracking-wider mb-1" numberOfLines={1}>
          {product.category?.name || 'Handcrafted'}
        </Text>
        <Text className="text-sm font-sans text-ink font-medium leading-5" numberOfLines={1}>
          {product.name}
        </Text>
        <View className="flex-row items-baseline gap-2 mt-1">
          <Text className="text-base font-bold text-accent">{formatPrice(product.price)}</Text>
          {product.original_price && (
            <Text className="text-xs text-clay-brown/70 line-through">{formatPrice(product.original_price)}</Text>
          )}
        </View>
        <View className="flex-row items-center mt-3 gap-2">
          <TouchableOpacity
            className="flex-1 bg-accent py-2.5 rounded-lg items-center justify-center flex-row"
            onPress={() => addItem(product)}
          >
            <ShoppingBag size={14} color="white" />
            <Text className="text-xs text-white font-bold ml-1.5">Add to Bag</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-2 border border-border rounded-lg justify-center items-center"
            onPress={() => toggleItem(product.id)}
          >
            <Heart 
              size={16} 
              color={isInWishlist(product.id) ? colors.accent : colors.clayBrown} 
              fill={isInWishlist(product.id) ? colors.accent : 'transparent'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Live Myntra-Style Location Header */}
      <View className="px-4 pt-2 pb-3 border-b border-border/20 bg-background flex-row justify-between items-center">
        <View className="flex-row items-center flex-1">
          <MapPin size={18} color={colors.accent} />
          <View className="ml-2">
            <View className="flex-row items-center">
              <Text className="text-[10px] font-sans font-bold text-clay-brown uppercase tracking-wider">Deliver to</Text>
              <ChevronRight size={10} color={colors.clayBrown} className="ml-1" />
            </View>
            <Text className="text-xs font-semibold text-ink -mt-0.5">Delhi - National Capital Region, India</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.push('/wishlist')} className="p-1">
            <Heart size={20} color={colors.ink} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/cart')} className="p-1">
            <ShoppingBag size={20} color={colors.ink} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Premium Search Bar */}
      <TouchableOpacity 
        className="mx-4 my-2.5 px-4 py-2.5 bg-secondary/40 rounded-xl flex-row items-center border border-border/30"
        onPress={() => router.push('/shop')}
        activeOpacity={0.8}
      >
        <Search size={18} color={colors.clayBrown} />
        <Text className="text-clay-brown/70 text-sm ml-3 flex-1 font-sans">
          Search for coffee mugs, dinner sets, vases...
        </Text>
        <Sparkles size={16} color={colors.gold} />
      </TouchableOpacity>

      {/* Main Department Tabs Selector */}
      <View className="border-b border-border/30 bg-background mb-3">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 16, gap: 20 }}
          className="py-1"
        >
          <TouchableOpacity 
            className="pb-2 relative" 
            onPress={() => setSelectedTab('ALL')}
          >
            <Text className={`text-sm font-sans tracking-wide ${selectedTab === 'ALL' ? 'font-bold text-accent' : 'font-medium text-clay-brown'}`}>
              All
            </Text>
            {selectedTab === 'ALL' && <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />}
          </TouchableOpacity>
          
          {customCategories.map((cat) => (
            <TouchableOpacity 
              key={cat.slug} 
              className="pb-2 relative" 
              onPress={() => setSelectedTab(cat.slug)}
            >
              <Text className={`text-sm font-sans tracking-wide ${selectedTab === cat.slug ? 'font-bold text-accent' : 'font-medium text-clay-brown'}`}>
                {cat.name}
              </Text>
              {selectedTab === cat.slug && <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Dynamic Category Circles (Sub-Categories) */}
        <View className="mb-4 mt-1">
          <View className="px-4 mb-2 flex-row justify-between items-center">
            <Text className="text-xs font-bold text-clay-brown/80 uppercase tracking-wider">
              {selectedTab === 'ALL' ? 'Explore Departments' : `${activeCategory?.name} Collections`}
            </Text>
            <TouchableOpacity onPress={() => router.push(selectedTab === 'ALL' ? '/shop' : `/shop?category=${selectedTab}`)}>
              <Text className="text-accent text-xs font-bold">View Shop</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={circlesData}
            keyExtractor={(item) => item.slug}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
            renderItem={({ item }) => (
              <TouchableOpacity 
                className="items-center" 
                onPress={() => handleCategoryPress(item)}
              >
                <View className="p-0.5 rounded-full border border-border/80">
                  <Image source={{ uri: item.image }} className="w-16 h-16 rounded-full" resizeMode="cover" />
                </View>
                <Text className="text-[10px] text-ink font-semibold mt-1.5 text-center w-16" numberOfLines={2}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Swadeshi Coupon Code Promo Strip */}
        <View className="mx-4 mb-5 bg-accent rounded-xl overflow-hidden shadow-sm">
          <View className="flex-row items-center justify-between px-4 py-3">
            <View className="flex-row items-center gap-2 flex-1">
              <Tag size={16} color="white" />
              <View className="ml-1">
                <Text className="text-xs font-bold text-white uppercase tracking-wider">Flat 15% OFF First Order</Text>
                <Text className="text-[10px] text-white/90">Supporting local Indian ceramic artisans</Text>
              </View>
            </View>
            <View className="bg-white/20 border border-white/30 px-3 py-1 rounded-lg">
              <Text className="text-white text-xs font-bold uppercase tracking-widest">SWADESHI15</Text>
            </View>
          </View>
        </View>

        {/* Dynamic Campaign Carousel */}
        <View className="mb-6 relative">
          <FlatList
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={banners}
            keyExtractor={(item) => item.id.toString()}
            onMomentumScrollEnd={(e) => {
              const contentOffset = e.nativeEvent.contentOffset.x
              const viewSize = e.nativeEvent.layoutMeasurement.width
              const newIndex = Math.round(contentOffset / viewSize)
              setActiveBannerIndex(newIndex)
            }}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={{ width: 400 }} // fallback, will auto scale
                className="px-4"
                activeOpacity={0.9}
                onPress={() => router.push(`/shop?category=${item.category}`)}
              >
                <View className="h-48 bg-ink rounded-2xl overflow-hidden relative shadow-md">
                  <Image
                    source={{ uri: item.image }}
                    className="w-full h-full opacity-70"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 justify-end">
                    <Text className="text-white text-xl font-bold font-serif leading-6">{item.title}</Text>
                    <Text className="text-white/80 text-xs mt-1.5 font-sans leading-4">{item.subtitle}</Text>
                    <View className="flex-row items-center mt-3 gap-1">
                      <Text className="text-white text-xs font-bold uppercase tracking-wider">Explore Collection</Text>
                      <ChevronRight size={12} color="white" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
          {/* Indicator dots */}
          <View className="flex-row justify-center gap-1.5 mt-3">
            {banners.map((_, i) => (
              <View 
                key={i} 
                className={`h-1.5 rounded-full ${activeBannerIndex === i ? 'w-4 bg-accent' : 'w-1.5 bg-border'}`} 
              />
            ))}
          </View>
        </View>

        {/* Swadeshi Core Trust Badges */}
        <View className="mx-4 mb-6 bg-secondary/20 rounded-xl p-4 border border-border/30 flex-row justify-around">
          {trustBadges.map((badge, idx) => (
            <View key={idx} className="items-center w-[30%]">
              <Text className="text-lg mb-1">{badge.icon}</Text>
              <Text className="text-[10px] font-bold text-ink text-center leading-4">{badge.title}</Text>
              <Text className="text-[8px] text-clay-brown text-center leading-3">{badge.subtitle}</Text>
            </View>
          ))}
        </View>

        {/* Products Grid */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center px-4 mb-3">
            <View>
              <Text className="text-base font-bold text-ink leading-5">
                {selectedTab === 'ALL' ? 'Featured Masterpieces' : `Best in ${activeCategory?.name}`}
              </Text>
              <Text className="text-[10px] text-clay-brown uppercase tracking-wider mt-0.5">Handpicked for you</Text>
            </View>
            <TouchableOpacity onPress={() => router.push(selectedTab === 'ALL' ? '/shop' : `/shop?category=${selectedTab}`)}>
              <Text className="text-accent text-xs font-bold">See All ({filteredProducts.length})</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View className="px-4 py-8 items-center">
              <Text className="text-clay-brown text-sm">Loading authentic ceramics...</Text>
            </View>
          ) : filteredProducts.length === 0 ? (
            <View className="mx-4 p-8 bg-secondary/10 rounded-2xl items-center border border-dashed border-border">
              <Text className="text-clay-brown text-sm text-center">New arrivals under this collection are coming soon!</Text>
              <TouchableOpacity 
                className="mt-3 bg-accent px-4 py-2 rounded-lg"
                onPress={() => setSelectedTab('ALL')}
              >
                <Text className="text-white text-xs font-bold">Browse All Products</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row flex-wrap px-2">
              {filteredProducts.slice(0, 6).map((product) => (
                <View key={product.id} style={{ width: '50%' }}>
                  <ProductCard product={product} />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Pottery Clusters Hub */}
        <View className="mb-6 bg-secondary/30 py-5">
          <View className="px-4 mb-3">
            <Text className="text-base font-bold text-ink">Famous Artisan Clusters</Text>
            <Text className="text-[10px] text-clay-brown uppercase tracking-wider mt-0.5">Heritage pottery hubs of India</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
          >
            {potteryClusters.map((cluster) => (
              <View 
                key={cluster.id} 
                className="w-64 bg-white rounded-xl overflow-hidden border border-border/50 shadow-sm"
              >
                <Image source={{ uri: cluster.image }} className="w-full h-32" resizeMode="cover" />
                <View className="p-3">
                  <View className="flex-row justify-between items-baseline">
                    <Text className="font-bold text-ink text-sm">{cluster.name}</Text>
                    <Text className="text-[8px] bg-secondary px-1.5 py-0.5 rounded text-clay-brown uppercase tracking-wider font-semibold">
                      {cluster.location}
                    </Text>
                  </View>
                  <Text className="text-[10px] text-clay-brown mt-1 leading-4" numberOfLines={2}>
                    {cluster.description}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Brand Story */}
        <View className="mx-4 mb-6 bg-secondary/40 rounded-2xl p-6 border border-border/20">
          <View className="flex-row items-center gap-2 mb-2">
            <Sparkles size={16} color={colors.accent} />
            <Text className="text-base font-bold text-ink">The Swadeshi Heritage</Text>
          </View>
          <Text className="text-xs text-clay-brown leading-5">
            Every cup, bowl, and planter in our collection is hand-crafted in wood-fired kilns by traditional Indian artisans. By shopping on Hindustani Saudagar, you bring organic, sustainable luxury home while keeping ancestral pottery craft thriving.
          </Text>
        </View>

        {/* Footer */}
        <View className="bg-ink px-6 py-8 mt-4">
          <Text className="text-cream text-xl font-serif text-center font-bold tracking-wide">Hindustani Saudagar</Text>
          <Text className="text-cream/50 text-[10px] text-center mt-1.5 font-hindi tracking-wider">हस्तनिर्मित · देश की मिट्टी</Text>
          <Text className="text-cream/30 text-[9px] text-center mt-6">© 2026 Hindustani Saudagar. Supporting Rural Potters.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
