import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View, Text } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={{ flex: 1, backgroundColor: 'red' }}>
        <Text style={{ color: 'white', marginTop: 50 }}>Debug: SafeAreaProvider only</Text>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="product/[slug]" options={{ headerShown: true, title: 'Product' }} />
          <Stack.Screen name="auth/login" options={{ headerShown: true, title: 'Sign In' }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: true, title: 'Sign Up' }} />
          <Stack.Screen name="checkout/index" options={{ headerShown: true, title: 'Checkout' }} />
          <Stack.Screen name="account/index" options={{ headerShown: true, title: 'My Account' }} />
          <Stack.Screen name="account/orders" options={{ headerShown: true, title: 'Orders' }} />
        </Stack>
      </View>
    </SafeAreaProvider>
  )
}
