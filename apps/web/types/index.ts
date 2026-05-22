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
  
  // New fields
  sku?: string
  brand?: string
  short_description?: string
  specifications?: ProductSpecifications
  safety_features?: string[]
  features?: ProductFeature[]
  product_story?: string
  tradition_section?: string
  made_in_india_section?: string
  handmade_disclaimer?: string
  feature_icons?: string[]
  section_images?: string[]
  banner_image?: string
  product_story_banner?: string
  tradition_banner?: string
  made_in_india_banner?: string
  local_hands_banner?: string
  meta_title?: string
  meta_description?: string
  category_ids?: string[]
  is_comparable?: boolean
  has_variations?: boolean
  gst_rate?: number
  
  category?: Category
  variations?: ProductVariation[]
}

export interface ProductSpecifications {
  material?: string
  contents?: string
  capacity?: string
  dimensions?: string
  weight?: string
  color?: string
  package_includes?: string
}

export interface ProductFeature {
  title: string
  icon_url: string
  description: string
}

export interface ProductVariation {
  id: string
  product_id: string
  sku: string
  color_name?: string
  color_hex?: string
  price?: number
  stock: number
  image_url?: string
  is_active: boolean
  created_at: string
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
  variation_id?: string
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
  // GST fields
  cgst?: number
  sgst?: number
  igst?: number
  tax_amount?: number
  subtotal?: number
  shipping_cost?: number
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variation_id?: string
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
