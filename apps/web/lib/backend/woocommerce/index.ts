import { WooCommerceClient } from './client'
import { createWooCommerceProducts } from './products'
import { createWooCommerceCategories } from './categories'
import { createWooCommerceOrders } from './orders'
import { BackendProvider } from '../types'

export function createWooCommerceBackend(): BackendProvider {
  const client = new WooCommerceClient()
  
  const products = createWooCommerceProducts(client)
  const categories = createWooCommerceCategories(client)
  const orders = createWooCommerceOrders(client)
  
  return {
    getProducts: products.getProducts,
    getProduct: products.getProduct,
    getProductBySlug: products.getProductBySlug,
    createProduct: products.createProduct,
    updateProduct: products.updateProduct,
    deleteProduct: products.deleteProduct,
    getProductVariations: products.getProductVariations,
    
    getCategories: categories.getCategories,
    createCategory: categories.createCategory,
    updateCategory: categories.updateCategory,
    deleteCategory: categories.deleteCategory,
    
    getOrders: orders.getOrders,
    getOrder: orders.getOrder,
    createOrder: orders.createOrder,
    updateOrderStatus: orders.updateOrderStatus,
    
    getCart: async () => [],
    addToCart: async () => ({} as any),
    updateCart: async () => {},
    removeFromCart: async () => {},
    clearCart: async () => {},
  }
}
