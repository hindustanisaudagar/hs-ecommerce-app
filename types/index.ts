export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  original_price: number | null
  category_id: string | null
  images: string[]
  stock: number
  is_active: boolean
  tags: string[]
  created_at: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  parent_id: string | null
}

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string
  shipping_address: Record<string, any>
  billing_address: Record<string, any> | null
  payment_method: string | null
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product?: Product
}

export interface User {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: string
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  product_id: string
  rating: number
  comment: string | null
  created_at: string
  user?: {
    name: string | null
  }
}

export interface Coupon {
  id: string
  code: string
  discount_type: string
  discount_value: number
  min_order_amount: number | null
  max_uses: number | null
  used_count: number
  is_active: boolean
  expires_at: string | null
}

export interface Address {
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
