import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors, supabase } from '@hs/shared'
import { useState } from 'react'

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.back()
    } catch (e: any) {
      Alert.alert('Login Failed', e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: 'hindustani-saudagar://auth/callback' },
      })
    } catch (e: any) {
      Alert.alert('Error', e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-serif text-ink text-center">Welcome Back</Text>
        <Text className="text-sm text-clay-brown text-center mt-2">Sign in to your account</Text>

        <View className="mt-8 gap-4">
          <View>
            <Text className="text-xs text-clay-brown mb-1">Email</Text>
            <TextInput
              className="bg-white border border-border rounded-xl px-4 py-3.5 text-ink"
              placeholder="your@email.com"
              placeholderTextColor={colors.clayBrown}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View>
            <Text className="text-xs text-clay-brown mb-1">Password</Text>
            <TextInput
              className="bg-white border border-border rounded-xl px-4 py-3.5 text-ink"
              placeholder="••••••••"
              placeholderTextColor={colors.clayBrown}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity className="mt-2 self-end">
          <Text className="text-accent text-sm">Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-6 bg-ink py-4 rounded-full items-center"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center mt-6">
          <View className="flex-1 h-px bg-border" />
          <Text className="mx-4 text-clay-brown text-sm">or</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        <TouchableOpacity
          className="mt-6 border border-border py-4 rounded-full items-center flex-row justify-center gap-3"
          onPress={handleGoogleLogin}
        >
          <Text className="text-ink font-medium">Continue with Google</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-8">
          <Text className="text-clay-brown">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/signup')}>
            <Text className="text-accent font-medium">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
