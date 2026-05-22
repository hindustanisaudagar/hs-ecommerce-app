import { Tabs } from 'expo-router'
import { View, Text } from 'react-native'
import { colors } from '@hs/shared'
import { useCart, useWishlist } from '@hs/shared'
import { Home, ShoppingBag, Heart, User, Search } from 'lucide-react-native'

export default function TabLayout() {
  const cartCount = useCart((s) => s.getTotalItems())
  const wishlistCount = useWishlist((s) => s.items.length)

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.terracotta,
        tabBarInactiveTintColor: colors.clayBrown,
        tabBarStyle: {
          backgroundColor: colors.cream,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter',
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View>
              <ShoppingBag size={size} color={color} />
              {cartCount > 0 && (
                <View className="absolute -top-2 -right-2 bg-accent rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white text-xs font-bold">{cartCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Heart size={size} color={color} />
              {wishlistCount > 0 && (
                <View className="absolute -top-2 -right-2 bg-accent rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white text-xs font-bold">{wishlistCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
