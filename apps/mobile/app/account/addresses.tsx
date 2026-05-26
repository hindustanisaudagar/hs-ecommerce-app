import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors, supabase } from '@hs/shared'
import { useEffect, useState } from 'react'
import { MapPin, Plus, Trash2, Edit2, ArrowLeft, Check, X } from 'lucide-react-native'

interface Address {
  id: string
  user_id: string
  name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  pincode: string
  is_default: boolean
  created_at: string
}

export default function AddressesScreen() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal / Form States
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        loadAddresses(data.user.id)
      } else {
        setLoading(false)
        Alert.alert('Authentication Required', 'Please sign in to manage addresses', [
          { text: 'OK', onPress: () => router.replace('/auth/login') }
        ])
      }
    })
  }, [])

  const loadAddresses = async (userId: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        
      if (error) throw error
      if (data) setAddresses(data as Address[])
    } catch (e: any) {
      console.log('Error loading addresses:', e.message)
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingAddressId(null)
    setName('')
    setPhone('')
    setAddressLine1('')
    setAddressLine2('')
    setCity('')
    setState('')
    setPincode('')
    setIsDefault(addresses.length === 0) // Default if it is the first address
    setIsModalVisible(true)
  }

  const openEditModal = (address: Address) => {
    setEditingAddressId(address.id)
    setName(address.name)
    setPhone(address.phone)
    setAddressLine1(address.address_line1)
    setAddressLine2(address.address_line2 || '')
    setCity(address.city)
    setState(address.state)
    setPincode(address.pincode)
    setIsDefault(address.is_default)
    setIsModalVisible(true)
  }

  const handleSave = async () => {
    if (!name || !phone || !addressLine1 || !city || !state || !pincode) {
      Alert.alert('Error', 'Please fill in all required fields')
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

    setSaving(true)
    try {
      let savedId = editingAddressId

      if (editingAddressId) {
        // Update
        const { error } = await supabase
          .from('addresses')
          .update({
            name,
            phone,
            address_line1: addressLine1,
            address_line2: addressLine2 || null,
            city,
            state,
            pincode,
            is_default: isDefault
          })
          .eq('id', editingAddressId)
        
        if (error) throw error
      } else {
        // Insert
        const { data, error } = await supabase
          .from('addresses')
          .insert({
            user_id: user.id,
            name,
            phone,
            address_line1: addressLine1,
            address_line2: addressLine2 || null,
            city,
            state,
            pincode,
            is_default: isDefault
          })
          .select()
        
        if (error) throw error
        if (data && data[0]) savedId = data[0].id
      }

      // If set as default, set all other addresses to false
      if (isDefault && savedId) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .neq('id', savedId)
      }

      setIsModalVisible(false)
      Alert.alert('Success', editingAddressId ? 'Address updated successfully' : 'Address added successfully')
      loadAddresses(user.id)
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save address')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (id: string) => {
    Alert.alert('Delete Address', 'Are you sure you want to delete this shipping address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('addresses')
              .delete()
              .eq('id', id)
            if (error) throw error
            loadAddresses(user.id)
          } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to delete address')
          }
        }
      }
    ])
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-border/20 bg-background flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-2">
          <ArrowLeft size={22} color={colors.ink} />
        </TouchableOpacity>
        <Text className="text-xl font-serif text-ink flex-1">My Addresses</Text>
        <TouchableOpacity 
          className="bg-accent px-3 py-1.5 rounded-lg flex-row items-center" 
          onPress={openAddModal}
        >
          <Plus size={14} color="white" />
          <Text className="text-xs text-white font-bold ml-1">Add New</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.accent} />
          <Text className="text-clay-brown text-sm mt-3">Loading saved addresses...</Text>
        </View>
      ) : addresses.length === 0 ? (
        /* Empty State */
        <View className="flex-1 justify-center items-center px-8 text-center bg-background">
          <View className="w-20 h-20 rounded-full bg-secondary/50 justify-center items-center mb-4">
            <MapPin size={36} color={colors.clayBrown} strokeWidth={1.5} />
          </View>
          <Text className="text-lg font-bold text-ink">No Saved Addresses</Text>
          <Text className="text-xs text-clay-brown text-center mt-2 px-4 leading-5">
            Add a shipping address to enjoy a faster, premium one-tap checkout process.
          </Text>
          <TouchableOpacity 
            className="mt-6 bg-accent px-6 py-3 rounded-full flex-row items-center"
            onPress={openAddModal}
          >
            <Plus size={16} color="white" />
            <Text className="text-white font-bold ml-2 text-sm">Add Your First Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Addresses List */
        <ScrollView className="flex-1 px-4 py-3" showsVerticalScrollIndicator={false}>
          {addresses.map((item) => (
            <View 
              key={item.id} 
              className={`bg-white rounded-xl p-4 border mb-3 flex-row relative ${item.is_default ? 'border-accent/40 shadow-sm' : 'border-border/60'}`}
              style={item.is_default ? { shadowColor: colors.accent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 } : {}}
            >
              <View className="flex-1 pr-6">
                <View className="flex-row items-center gap-2 mb-1.5">
                  <Text className="font-bold text-ink text-sm leading-5">{item.name}</Text>
                  {item.is_default && (
                    <View className="bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                      <Text className="text-[9px] text-accent font-bold uppercase tracking-wider">Default</Text>
                    </View>
                  )}
                </View>
                <Text className="text-xs text-clay-brown font-medium leading-4 mb-2">{item.phone}</Text>
                <Text className="text-xs text-ink leading-5">{item.address_line1}</Text>
                {item.address_line2 && (
                  <Text className="text-xs text-ink leading-5">{item.address_line2}</Text>
                )}
                <Text className="text-xs text-ink font-semibold mt-1">
                  {item.city}, {item.state} - {item.pincode}
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="justify-between items-end gap-4 py-1">
                <TouchableOpacity onPress={() => openEditModal(item)} className="p-1">
                  <Edit2 size={16} color={colors.clayBrown} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} className="p-1">
                  <Trash2 size={16} color={colors.accent} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <View className="h-10" />
        </ScrollView>
      )}

      {/* Add/Edit Address Form Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-2xl px-5 pt-5 pb-8 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-lg font-serif text-ink font-bold">
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className="p-1">
                <X size={20} color={colors.ink} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
              <View className="gap-3.5">
                <View>
                  <Text className="text-xs font-bold text-clay-brown uppercase mb-1">Contact Name *</Text>
                  <TextInput 
                    className="bg-background border border-border rounded-xl px-4 py-3 text-ink text-sm" 
                    placeholder="e.g. Rahul Sharma" 
                    placeholderTextColor={colors.clayBrown + '60'} 
                    value={name} 
                    onChangeText={setName} 
                  />
                </View>

                <View>
                  <Text className="text-xs font-bold text-clay-brown uppercase mb-1">10-Digit Mobile Number *</Text>
                  <TextInput 
                    className="bg-background border border-border rounded-xl px-4 py-3 text-ink text-sm" 
                    placeholder="e.g. 9876543210" 
                    placeholderTextColor={colors.clayBrown + '60'} 
                    value={phone} 
                    onChangeText={setPhone} 
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>

                <View>
                  <Text className="text-xs font-bold text-clay-brown uppercase mb-1">Flat, House No, Street Address *</Text>
                  <TextInput 
                    className="bg-background border border-border rounded-xl px-4 py-3 text-ink text-sm" 
                    placeholder="e.g. B-102, Shanti Kunj, Sector 4" 
                    placeholderTextColor={colors.clayBrown + '60'} 
                    value={addressLine1} 
                    onChangeText={setAddressLine1} 
                    multiline
                  />
                </View>

                <View>
                  <Text className="text-xs font-bold text-clay-brown uppercase mb-1">Landmark / Locality (Optional)</Text>
                  <TextInput 
                    className="bg-background border border-border rounded-xl px-4 py-3 text-ink text-sm" 
                    placeholder="e.g. Near Hanuman Temple" 
                    placeholderTextColor={colors.clayBrown + '60'} 
                    value={addressLine2} 
                    onChangeText={setAddressLine2} 
                  />
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-clay-brown uppercase mb-1">City *</Text>
                    <TextInput 
                      className="bg-background border border-border rounded-xl px-4 py-3 text-ink text-sm" 
                      placeholder="City" 
                      placeholderTextColor={colors.clayBrown + '60'} 
                      value={city} 
                      onChangeText={setCity} 
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-clay-brown uppercase mb-1">State *</Text>
                    <TextInput 
                      className="bg-background border border-border rounded-xl px-4 py-3 text-ink text-sm" 
                      placeholder="State" 
                      placeholderTextColor={colors.clayBrown + '60'} 
                      value={state} 
                      onChangeText={setState} 
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-xs font-bold text-clay-brown uppercase mb-1">6-Digit Pincode *</Text>
                  <TextInput 
                    className="bg-background border border-border rounded-xl px-4 py-3 text-ink text-sm" 
                    placeholder="e.g. 110001" 
                    placeholderTextColor={colors.clayBrown + '60'} 
                    value={pincode} 
                    onChangeText={setPincode} 
                    keyboardType="numeric"
                    maxLength={6}
                  />
                </View>

                {/* Default Toggle Switch */}
                <View className="flex-row justify-between items-center bg-secondary/25 border border-border/40 p-3.5 rounded-xl mt-1">
                  <View className="flex-1 pr-4">
                    <Text className="text-sm font-bold text-ink">Set as Default Address</Text>
                    <Text className="text-[10px] text-clay-brown leading-4 mt-0.5">Auto-populate this address for standard fast checkout.</Text>
                  </View>
                  <Switch 
                    value={isDefault} 
                    onValueChange={setIsDefault}
                    trackColor={{ false: '#E5DDD2', true: colors.accent + '60' }}
                    thumbColor={isDefault ? colors.accent : '#f4f3f4'}
                  />
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity 
              className="bg-accent py-4 rounded-xl flex-row justify-center items-center"
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Check size={18} color="white" />
                  <Text className="text-white font-bold ml-2 text-sm uppercase tracking-wider">Save Address</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
