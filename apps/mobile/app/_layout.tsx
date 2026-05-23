import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View, Text } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { colors } from '@hs/shared'
import "../global.css"

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={{ flex: 1, backgroundColor: 'red' }}>
        <Text style={{ color: 'white', marginTop: 50 }}>Debug: all imports OK, no tabs</Text>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </View>
    </SafeAreaProvider>
  )
}
