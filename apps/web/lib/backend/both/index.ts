import { BackendProvider } from '../types'
import { createSupabaseBackend } from '../supabase'
import { createWooCommerceBackend } from '../woocommerce'

export function createDualBackend(): BackendProvider {
  const supabase = createSupabaseBackend()
  const woo = createWooCommerceBackend()
  
  return {
    getProducts: supabase.getProducts,
    getProduct: supabase.getProduct,
    getProductBySlug: supabase.getProductBySlug,
    getCategories: supabase.getCategories,
    getOrders: supabase.getOrders,
    getOrder: supabase.getOrder,
    getCart: supabase.getCart,
    getProductVariations: supabase.getProductVariations,
    
    async createProduct(data: any) {
      const supabaseProduct = await supabase.createProduct(data)
      
      try {
        await woo.createProduct(data)
      } catch (error) {
        console.error('Failed to sync product to WooCommerce:', error)
      }
      
      return supabaseProduct
    },
    
    async updateProduct(id: string, data: any) {
      const supabaseProduct = await supabase.updateProduct(id, data)
      
      try {
        await woo.updateProduct(id, data)
      } catch (error) {
        console.error('Failed to sync product update to WooCommerce:', error)
      }
      
      return supabaseProduct
    },
    
    async deleteProduct(id: string) {
      await supabase.deleteProduct(id)
      
      try {
        await woo.deleteProduct(id)
      } catch (error) {
        console.error('Failed to sync product deletion to WooCommerce:', error)
      }
    },
    
    async createCategory(data: any) {
      const supabaseCategory = await supabase.createCategory(data)
      
      try {
        await woo.createCategory(data)
      } catch (error) {
        console.error('Failed to sync category to WooCommerce:', error)
      }
      
      return supabaseCategory
    },
    
    async updateCategory(id: string, data: any) {
      const supabaseCategory = await supabase.updateCategory(id, data)
      
      try {
        await woo.updateCategory(id, data)
      } catch (error) {
        console.error('Failed to sync category update to WooCommerce:', error)
      }
      
      return supabaseCategory
    },
    
    async deleteCategory(id: string) {
      await supabase.deleteCategory(id)
      
      try {
        await woo.deleteCategory(id)
      } catch (error) {
        console.error('Failed to sync category deletion to WooCommerce:', error)
      }
    },
    
    createOrder: supabase.createOrder,
    updateOrderStatus: supabase.updateOrderStatus,
    addToCart: supabase.addToCart,
    updateCart: supabase.updateCart,
    removeFromCart: supabase.removeFromCart,
    clearCart: supabase.clearCart,
  }
}
