import { Product, Category, Order, CartItem, ProductVariation } from '@/types'

export interface ProductQuery {
  category?: string
  categoryIds?: string[]
  search?: string
  slug?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface ProductResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CategoryQuery {
  hierarchical?: boolean
}

export interface OrderInput {
  items: Array<{
    product_id: string
    variation_id?: string
    quantity: number
    price: number
  }>
  shipping_address: Record<string, any>
  billing_address: Record<string, any> | null
  payment_method: string
  user_id?: string
}

export interface BackendProvider {
  // Products
  getProducts(params: ProductQuery): Promise<ProductResponse>
  getProduct(id: string): Promise<Product>
  getProductBySlug(slug: string): Promise<Product>
  createProduct(data: any): Promise<Product>
  updateProduct(id: string, data: any): Promise<Product>
  deleteProduct(id: string): Promise<void>
  getProductVariations(productId: string): Promise<ProductVariation[]>
  
  // Categories
  getCategories(params?: CategoryQuery): Promise<Category[]>
  createCategory(data: any): Promise<Category>
  updateCategory(id: string, data: any): Promise<Category>
  deleteCategory(id: string): Promise<void>
  
  // Orders
  getOrders(userId?: string): Promise<Order[]>
  getOrder(id: string, userId?: string): Promise<Order>
  createOrder(data: OrderInput): Promise<Order>
  updateOrderStatus(id: string, status: string): Promise<Order>
  
  // Cart
  getCart(userId: string): Promise<CartItem[]>
  addToCart(userId: string, productId: string, qty: number, variationId?: string): Promise<CartItem>
  updateCart(userId: string, productId: string, qty: number): Promise<void>
  removeFromCart(userId: string, productId: string): Promise<void>
  clearCart(userId: string): Promise<void>
}
