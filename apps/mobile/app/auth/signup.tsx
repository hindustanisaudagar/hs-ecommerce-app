import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors } from '@hs/shared'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function SignupScreen() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      })
      if (error) throw error
      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          name,
          role: 'customer',
        })
      }
      Alert.alert('Success', 'Account created! Check your email for verification.', [
        { text: 'OK', onPress: () => router.back() },
      ])
    } catch (e: any) {
      Alert.alert('Signup Failed', e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-serif text-ink text-center">Create Account</Text>
        <Text className="text-sm text-clay-brown text-center mt-2">Join Hindustani Saudagar</Text>

        <View className="mt-8 gap-4">
          <View>
            <Text className="text-xs text-clay-brown mb-1">Full Name</Text>
            <TextInput
              className="bg-white border border-border rounded-xl px-4 py-3.5 text-ink"
              placeholder="Your Name"
              placeholderTextColor={colors.clayBrown}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
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
              placeholder="Min. 6 characters"
              placeholderTextColor={colors.clayBrown}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity
          className="mt-8 bg-ink py-4 rounded-full items-center"
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Create Account</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-8">
          <Text className="text-clay-brown">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text className="text-accent font-medium">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
