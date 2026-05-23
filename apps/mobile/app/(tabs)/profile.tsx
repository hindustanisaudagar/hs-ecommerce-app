import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors } from '@hs/shared'
import { User, Package, MapPin, Settings, LogOut, ChevronRight, Heart, ShoppingBag } from 'lucide-react-native'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useWishlist, useCart } from '@hs/shared'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://yetqthumnxkxlujudrbd.supabase.co'
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlldHF0aHVtbnhreGx1anVkcmJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzYzMDcsImV4cCI6MjA5NDc1MjMwN30.I3WlUeJTgmXE3gGeW_Iqwce2up4y_8f7GBlPJ5sEooM'
const supabase = createClient(supabaseUrl, supabaseKey)

const menuItems = [
  { icon: Package, label: 'My Orders', href: '/account/orders' },
  { icon: MapPin, label: 'Addresses', href: '/account/addresses' },
  { icon: Heart, label: 'Wishlist', href: '/(tabs)/wishlist' },
  { icon: ShoppingBag, label: 'Compare', href: '/(tabs)/cart' },
  { icon: Settings, label: 'Settings', href: '/account/settings' },
]

export default function ProfileScreen() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
        <User size={64} color={colors.clayBrown} />
        <Text className="text-lg font-serif text-ink mt-4">Welcome</Text>
        <Text className="text-sm text-clay-brown mt-2 text-center">Sign in to access your account</Text>
        <TouchableOpacity className="mt-6 bg-accent px-8 py-3 rounded-full w-full" onPress={() => router.push('/auth/login')}>
          <Text className="text-white font-bold text-center">Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mt-3" onPress={() => router.push('/auth/signup')}>
          <Text className="text-accent">Create an Account</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 pt-2 pb-3">
        <Text className="text-2xl font-serif text-ink">My Account</Text>
      </View>
      <View className="px-4 mb-6">
        <View className="flex-row items-center bg-white rounded-xl p-4 border border-border">
          <View className="w-14 h-14 rounded-full bg-secondary items-center justify-center">
            <User size={28} color={colors.ink} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-base font-medium text-ink">{user.email}</Text>
            <Text className="text-xs text-clay-brown">Customer</Text>
          </View>
          <ChevronRight size={20} color={colors.clayBrown} />
        </View>
      </View>
      <View className="px-4">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center py-4 border-b border-border"
            onPress={() => router.push(item.href as any)}
          >
            <item.icon size={22} color={colors.ink} />
            <Text className="flex-1 ml-3 text-ink">{item.label}</Text>
            <ChevronRight size={18} color={colors.clayBrown} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          className="flex-row items-center py-4 mt-4"
          onPress={async () => { await supabase.auth.signOut(); setUser(null) }}
        >
          <LogOut size={22} color={colors.accent} />
          <Text className="ml-3 text-accent">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
