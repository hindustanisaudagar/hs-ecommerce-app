import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View, ActivityIndicator, Text } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { colors } from '@hs/shared'
import "../global.css"

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[slug]" options={{ headerShown: true, title: 'Product', headerTintColor: colors.ink, headerStyle: { backgroundColor: colors.cream } }} />
        <Stack.Screen name="auth/login" options={{ headerShown: true, title: 'Sign In', headerTintColor: colors.ink, headerStyle: { backgroundColor: colors.cream } }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: true, title: 'Sign Up', headerTintColor: colors.ink, headerStyle: { backgroundColor: colors.cream } }} />
        <Stack.Screen name="checkout/index" options={{ headerShown: true, title: 'Checkout', headerTintColor: colors.ink, headerStyle: { backgroundColor: colors.cream } }} />
        <Stack.Screen name="account/index" options={{ headerShown: true, title: 'My Account', headerTintColor: colors.ink, headerStyle: { backgroundColor: colors.cream } }} />
        <Stack.Screen name="account/orders" options={{ headerShown: true, title: 'Orders', headerTintColor: colors.ink, headerStyle: { backgroundColor: colors.cream } }} />
      </Stack>
    </SafeAreaProvider>
  )
}
