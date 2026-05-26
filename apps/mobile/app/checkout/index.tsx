import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors, formatPrice, supabase, useCart } from '@hs/shared'
import { useState, useEffect } from 'react'
import { CreditCard, Smartphone, Globe, ShieldCheck, X, CheckCircle, MapPin, Plus } from 'lucide-react-native'

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

  // Saved Addresses list from Supabase
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true)

  // Razorpay Simulation States
  const [isRazorpayVisible, setIsRazorpayVisible] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'success'>('select')
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | null>(null)
  const [paymentTxnId, setPaymentTxnId] = useState('')
  const [processingMessage, setProcessingMessage] = useState('Initiating secure transaction...')

  const total = getTotalPrice()
  const shipping = total >= 500 ? 0 : 49
  const grandTotal = total + shipping

  useEffect(() => {
    loadUserAndAddresses()
  }, [])

  const loadUserAndAddresses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          
        if (data && data.length > 0) {
          setSavedAddresses(data)
          // Pre-populate with default address
          const defaultAddr = data.find((a: any) => a.is_default) || data[0]
          if (defaultAddr) {
            handleSelectSavedAddress(defaultAddr)
          }
        }
      }
    } catch (e) {
      console.log('Error loading user addresses:', e)
    }
  }

  const handleSelectSavedAddress = (addr: any) => {
    setSelectedAddressId(addr.id)
    setName(addr.name)
    setPhone(addr.phone)
    setAddress(addr.address_line1 + (addr.address_line2 ? `, ${addr.address_line2}` : ''))
    setCity(addr.city)
    setState(addr.state)
    setPincode(addr.pincode)
  }

  const handlePlaceOrderClick = () => {
    if (!name || !phone || !address || !city || !state || !pincode) {
      Alert.alert('Error', 'Please fill in all shipping details')
      return
    }
    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number')
      return
    }
    if (!/^\d{6}$/.test(pincode)) {
      Alert.alert('Error', 'Please enter a valid 6-digit pincode')
      return
    }
    
    // Open Razorpay Checkout Simulation
    setPaymentStep('select')
    setSelectedMethod(null)
    setIsRazorpayVisible(true)
  }

  const startPaymentProcessing = (method: 'upi' | 'card' | 'netbanking') => {
    setSelectedMethod(method)
    setPaymentStep('processing')
    
    // Simulating secure network gateway processing steps
    setProcessingMessage('Connecting to secure banking servers...')
    
    setTimeout(() => {
      setProcessingMessage('Authorizing transaction amount...')
      
      setTimeout(() => {
        setProcessingMessage('Confirming secure payment status...')
        
        setTimeout(async () => {
          const txnId = `pay_${Math.random().toString(36).substring(2, 15).toUpperCase()}`
          setPaymentTxnId(txnId)
          setPaymentStep('success')
          
          // Complete and submit the order to the database
          await submitOrderToDatabase(txnId)
        }, 1200)
      }, 1000)
    }, 1000)
  }

  const submitOrderToDatabase = async (transactionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('orders').insert({
        user_id: user?.id,
        items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity, price: i.product.price })),
        shipping_address: { name, phone, address, city, state, pincode },
        total_amount: grandTotal,
        payment_method: 'Razorpay Online',
        razorpay_payment_id: transactionId,
        razorpay_order_id: `order_${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      })
      
      if (error) throw error

      // Auto-save the new address to the user profile database if selected
      if (saveAddressToProfile && !selectedAddressId && user) {
        const parts = address.split(',')
        const line1 = parts[0]?.trim() || address
        const line2 = parts.slice(1).join(',').trim() || null
        
        await supabase.from('addresses').insert({
          user_id: user.id,
          name,
          phone,
          address_line1: line1,
          address_line2: line2,
          city,
          state,
          pincode,
          is_default: savedAddresses.length === 0
        })
      }
    } catch (e: any) {
      console.log('Order insert failed: ', e.message)
    }
  }

  const handleSuccessDone = () => {
    setIsRazorpayVisible(false)
    clearCart()
    router.replace('/(tabs)')
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Custom Header back link */}
      <View className="px-4 py-3 border-b border-border/20 bg-background flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-2">
          <X size={20} color={colors.ink} />
        </TouchableOpacity>
        <Text className="text-xl font-serif text-ink flex-1">Checkout</Text>
      </View>

      <ScrollView className="flex-1 px-4 mt-2" showsVerticalScrollIndicator={false}>
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
          
          {/* Saved Addresses horizontal selector list */}
          {savedAddresses.length > 0 && (
            <View className="mb-4">
              <Text className="text-[10px] font-bold text-clay-brown uppercase tracking-wider mb-2">Select Saved Address</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }} className="py-1">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id
                  return (
                    <TouchableOpacity
                      key={addr.id}
                      className={`px-4 py-2.5 rounded-xl border-2 flex-row items-center gap-1.5 ${isSelected ? 'border-accent bg-accent/5' : 'border-border bg-background/50'}`}
                      onPress={() => handleSelectSavedAddress(addr)}
                    >
                      <MapPin size={12} color={isSelected ? colors.accent : colors.clayBrown} />
                      <Text className={`text-xs font-semibold ${isSelected ? 'text-accent' : 'text-ink'}`}>
                        {addr.name} ({addr.city})
                      </Text>
                    </TouchableOpacity>
                  )
                })}
                <TouchableOpacity
                  className="px-4 py-2.5 rounded-xl border border-dashed border-border/80 flex-row items-center gap-1.5 bg-background/30"
                  onPress={() => {
                    setSelectedAddressId(null)
                    setName('')
                    setPhone('')
                    setAddress('')
                    setCity('')
                    setState('')
                    setPincode('')
                  }}
                >
                  <Plus size={12} color={colors.clayBrown} />
                  <Text className="text-xs text-clay-brown font-semibold">New Address</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}

          <View className="gap-3.5">
            <View>
              <Text className="text-[10px] font-bold text-clay-brown uppercase mb-1">Full Name</Text>
              <TextInput 
                className="bg-background border border-border rounded-xl px-4 py-3 text-ink text-sm" 
                placeholder="Full Name" 
                placeholderTextColor={colors.clayBrown + '60'} 
                value={name} 
                onChangeText={(text) => { setName(text); setSelectedAddressId(null); }} 
              />
            </View>

            <View>
              <Text className="text-[10px] font-bold text-clay-brown uppercase mb-1">Phone Number</Text>
              <TextInput 
                className="bg-background border border-border rounded-xl px-4 py-3 text-ink text-sm" 
                placeholder="Phone Number" 
                placeholderTextColor={colors.clayBrown + '60'} 
                value={phone} 
                onChangeText={(text) => { setPhone(text); setSelectedAddressId(null); }} 
                keyboardType="phone-pad" 
                maxLength={10} 
              />
            </View>

            <View>
              <Text className="text-[10px] font-bold text-clay-brown uppercase mb-1">Street Address</Text>
              <TextInput 
                className="bg-background border border-border rounded-xl px-4 py-3 text-ink text-sm" 
                placeholder="Address" 
                placeholderTextColor={colors.clayBrown + '60'} 
                value={address} 
                onChangeText={(text) => { setAddress(text); setSelectedAddressId(null); }} 
                multiline 
              />
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-[10px] font-bold text-clay-brown uppercase mb-1">City</Text>
                <TextInput 
                  className="bg-background border border-border rounded-xl px-4 py-3 text-ink text-sm" 
                  placeholder="City" 
                  placeholderTextColor={colors.clayBrown + '60'} 
                  value={city} 
                  onChangeText={(text) => { setCity(text); setSelectedAddressId(null); }} 
                />
              </View>
              <View className="flex-1">
                <Text className="text-[10px] font-bold text-clay-brown uppercase mb-1">State</Text>
                <TextInput 
                  className="bg-background border border-border rounded-xl px-4 py-3 text-ink text-sm" 
                  placeholder="State" 
                  placeholderTextColor={colors.clayBrown + '60'} 
                  value={state} 
                  onChangeText={(text) => { setState(text); setSelectedAddressId(null); }} 
                />
              </View>
            </View>

            <View>
              <Text className="text-[10px] font-bold text-clay-brown uppercase mb-1">Pincode</Text>
              <TextInput 
                className="bg-background border border-border rounded-xl px-4 py-3 text-ink text-sm" 
                placeholder="Pincode" 
                placeholderTextColor={colors.clayBrown + '60'} 
                value={pincode} 
                onChangeText={(text) => { setPincode(text); setSelectedAddressId(null); }} 
                keyboardType="numeric" 
                maxLength={6} 
              />
            </View>

            {/* Checkbox to auto-save address if it's new */}
            {selectedAddressId === null && (
              <View className="flex-row justify-between items-center bg-secondary/15 border border-border/30 p-3.5 rounded-xl mt-2">
                <View className="flex-1 pr-4">
                  <Text className="text-xs font-bold text-ink">Save this address to my profile</Text>
                  <Text className="text-[9px] text-clay-brown mt-0.5">Saves this shipping information for one-tap checkout next time.</Text>
                </View>
                <Switch
                  value={saveAddressToProfile}
                  onValueChange={setSaveAddressToProfile}
                  trackColor={{ false: '#E5DDD2', true: colors.accent + '60' }}
                  thumbColor={saveAddressToProfile ? colors.accent : '#f4f3f4'}
                />
              </View>
            )}
          </View>
        </View>

        {/* Payment Method */}
        <View className="bg-white rounded-xl p-4 border border-border mb-4">
          <Text className="text-base font-medium text-ink mb-3">Payment Method</Text>
          <View className="flex-row items-center bg-secondary rounded-xl p-3">
            <Text className="text-ink text-sm">💳 Razorpay Secure Online Payment</Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-accent py-4 rounded-full items-center mb-8"
          onPress={handlePlaceOrderClick}
          disabled={loading}
        >
          <Text className="text-white font-bold text-base">Proceed to Pay • {formatPrice(grandTotal)}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Razorpay Checkout Simulation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isRazorpayVisible}
        onRequestClose={() => setIsRazorpayVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="bg-white rounded-2xl w-full overflow-hidden shadow-2xl" style={{ maxWidth: 400 }}>
            {/* Blue Razorpay Header */}
            <View className="bg-[#0b2447] px-6 py-5 flex-row justify-between items-center">
              <View>
                <Text className="text-white text-xs opacity-80 uppercase tracking-widest font-bold">Razorpay Secure</Text>
                <Text className="text-white text-lg font-serif mt-0.5">Hindustani Saudagar</Text>
              </View>
              <View className="items-end">
                <Text className="text-white text-xs opacity-75">Amount</Text>
                <Text className="text-white text-lg font-bold">{formatPrice(grandTotal)}</Text>
              </View>
            </View>

            {/* Step 1: Selection Sheet */}
            {paymentStep === 'select' && (
              <View className="p-6">
                <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Select Payment Method</Text>
                
                <View className="gap-3">
                  {/* UPI */}
                  <TouchableOpacity 
                    className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                    onPress={() => startPaymentProcessing('upi')}
                  >
                    <View className="flex-row items-center gap-3">
                      <Smartphone size={20} color="#0b2447" />
                      <View>
                        <Text className="text-sm font-bold text-gray-800">UPI / QR (Google Pay, PhonePe)</Text>
                        <Text className="text-xs text-gray-500">Pay instantly using UPI app</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Card */}
                  <TouchableOpacity 
                    className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                    onPress={() => startPaymentProcessing('card')}
                  >
                    <View className="flex-row items-center gap-3">
                      <CreditCard size={20} color="#0b2447" />
                      <View>
                        <Text className="text-sm font-bold text-gray-800">Credit / Debit Card</Text>
                        <Text className="text-xs text-gray-500">Visa, MasterCard, RuPay</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Netbanking */}
                  <TouchableOpacity 
                    className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                    onPress={() => startPaymentProcessing('netbanking')}
                  >
                    <View className="flex-row items-center gap-3">
                      <Globe size={20} color="#0b2447" />
                      <View>
                        <Text className="text-sm font-bold text-gray-800">Netbanking</Text>
                        <Text className="text-xs text-gray-500">All major Indian banks supported</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Footer Safe Seals */}
                <View className="flex-row justify-center items-center gap-2 mt-6 pt-4 border-t border-gray-100">
                  <ShieldCheck size={16} color="#10b981" />
                  <Text className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                    Secured by Razorpay • PCI-DSS Compliant
                  </Text>
                </View>
              </View>
            )}

            {/* Step 2: Processing Secure Transaction */}
            {paymentStep === 'processing' && (
              <View className="p-8 items-center">
                <ActivityIndicator size="large" color="#0b2447" className="mb-6" />
                <Text className="text-base font-bold text-gray-800 text-center">Processing Secure Payment</Text>
                <Text className="text-xs text-gray-500 text-center mt-2 px-4 leading-5">
                  {processingMessage}
                </Text>
                <Text className="text-[10px] text-gray-400 text-center mt-6">
                  Please do not press back or close the application.
                </Text>
              </View>
            )}

            {/* Step 3: Success Screen */}
            {paymentStep === 'success' && (
              <View className="p-8 items-center">
                <CheckCircle size={56} color="#10b981" className="mb-4" />
                <Text className="text-lg font-bold text-gray-800">Payment Successful</Text>
                
                <View className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 w-full mt-4 gap-2">
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-gray-500">Transaction ID</Text>
                    <Text className="text-xs font-bold text-emerald-800">{paymentTxnId}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-gray-500">Status</Text>
                    <Text className="text-xs font-bold text-emerald-800">CAPTURED</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-gray-500">Amount Paid</Text>
                    <Text className="text-xs font-bold text-emerald-800">{formatPrice(grandTotal)}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  className="bg-[#0b2447] py-3.5 w-full rounded-full items-center mt-6"
                  onPress={handleSuccessDone}
                >
                  <Text className="text-white font-bold text-sm">Continue shopping</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
