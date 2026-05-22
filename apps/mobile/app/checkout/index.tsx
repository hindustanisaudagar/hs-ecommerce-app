import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors, formatPrice, useCart } from '@hs/shared'
import { useState, useEffect } from 'react'

export default function CheckoutScreen() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [loading, setLoading] = useState(false)

  const total = getTotalPrice()
  const shipping = total >= 500 ? 0 : 49
  const grandTotal = total + shipping

  const handlePlaceOrder = async () => {
    if (!name || !phone || !address || !city || !state || !pincode) {
      Alert.alert('Error', 'Please fill in all shipping details')
      return
    }
    setLoading(true)
    try {
      // Create order via API
      const res = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity, price: i.product.price })),
          shipping_address: { name, phone, address, city, state, pincode },
          total_amount: grandTotal,
        }),
      })
      if (!res.ok) throw new Error('Failed to create order')
      clearCart()
      Alert.alert('Order Placed!', 'Your order has been placed successfully.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ])
    } catch (e: any) {
      Alert.alert('Error', e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-serif text-ink mt-2 mb-4">Checkout</Text>

        {/* Order Summary */}
        <View className="bg-white rounded-xl p-4 border border-border mb-4">
          <Text className="text-base font-medium text-ink mb-3">Order Summary</Text>
          {items.map((item) => (
            <View key={item.product.id} className="flex-row justify-between py-2 border-b border-border/50">
              <Text className="text-sm text-ink flex-1" numberOfLines={1}>{item.product.name} × {item.quantity}</Text>
              <Text className="text-sm text-accent font-medium">{formatPrice(item.product.price * item.quantity)}</Text>
            </View>
          ))}
          <View className="flex-row justify-between py-2">
            <Text className="text-sm text-clay-brown">Subtotal</Text>
            <Text className="text-sm text-ink">{formatPrice(total)}</Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className="text-sm text-clay-brown">Shipping</Text>
            <Text className="text-sm text-ink">{shipping === 0 ? 'Free' : formatPrice(shipping)}</Text>
          </View>
          <View className="flex-row justify-between pt-2 border-t border-border">
            <Text className="text-base font-bold text-ink">Total</Text>
            <Text className="text-base font-bold text-accent">{formatPrice(grandTotal)}</Text>
          </View>
        </View>

        {/* Shipping Details */}
        <View className="bg-white rounded-xl p-4 border border-border mb-4">
          <Text className="text-base font-medium text-ink mb-3">Shipping Details</Text>
          <View className="gap-3">
            <TextInput className="bg-background border border-border rounded-xl px-4 py-3 text-ink" placeholder="Full Name" placeholderTextColor={colors.clayBrown} value={name} onChangeText={setName} />
            <TextInput className="bg-background border border-border rounded-xl px-4 py-3 text-ink" placeholder="Phone Number" placeholderTextColor={colors.clayBrown} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <TextInput className="bg-background border border-border rounded-xl px-4 py-3 text-ink" placeholder="Address" placeholderTextColor={colors.clayBrown} value={address} onChangeText={setAddress} multiline />
            <View className="flex-row gap-3">
              <TextInput className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-ink" placeholder="City" placeholderTextColor={colors.clayBrown} value={city} onChangeText={setCity} />
              <TextInput className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-ink" placeholder="State" placeholderTextColor={colors.clayBrown} value={state} onChangeText={setState} />
            </View>
            <TextInput className="bg-background border border-border rounded-xl px-4 py-3 text-ink" placeholder="Pincode" placeholderTextColor={colors.clayBrown} value={pincode} onChangeText={setPincode} keyboardType="numeric" />
          </View>
        </View>

        {/* Payment Method */}
        <View className="bg-white rounded-xl p-4 border border-border mb-4">
          <Text className="text-base font-medium text-ink mb-3">Payment Method</Text>
          <View className="flex-row items-center bg-secondary rounded-xl p-3">
            <Text className="text-ink text-sm">💳 Razorpay (Credit/Debit/UPI)</Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-accent py-4 rounded-full items-center mb-8"
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Place Order • {formatPrice(grandTotal)}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
