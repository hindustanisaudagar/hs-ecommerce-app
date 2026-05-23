import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View, Text } from 'react-native'

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar style="light" />
      <Text style={{ color: 'white', fontSize: 24 }}>Debug: Layout Rendered</Text>
    </View>
  )
}
