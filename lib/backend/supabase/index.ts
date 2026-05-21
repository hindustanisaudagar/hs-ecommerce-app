import { createClient } from '@/lib/supabase/server'
import { BackendProvider, ProductQuery, ProductResponse, CategoryQuery, OrderInput } from '../types'

export function createSupabaseBackend(): BackendProvider {
  return {
    async getProducts(params: ProductQuery): Promise<ProductResponse> {
      const supabase = await createClient()
      
      // If categoryIds is provided, we need to check both category_id and category_ids
      if (params.categoryIds) {
        // Format UUIDs with quotes for Supabase or() filter
        const formattedIds = params.categoryIds.map(id => `"${id}"`).join(',')
        let query = supabase
          .from('products')
          .select('*, category:categories(name, slug)', { count: 'exact' })
          .eq('is_active', true)
          .or(
            `category_id.in.(${formattedIds})`
          )
        
        if (params.slug) {
          query = query.eq('slug', params.slug)
        }
        
        if (params.tag) {
          query = query.contains('tags', [params.tag])
        }
        
        if (params.search) {
          const searchTerm = `%${params.search}%`
          query = query.or(
            `name.ilike.${searchTerm},sku.ilike.${searchTerm},specifications->>color.ilike.${searchTerm}`
          )
        }
        
        if (params.minPrice) {
          query = query.gte('price', params.minPrice)
        }
        
        if (params.maxPrice) {
          query = query.lte('price', params.maxPrice)
        }
        
        query = query
          .order(params.sortBy || 'created_at', { ascending: params.sortOrder === 'asc' })
          .range((params.page! - 1) * params.limit!, params.page! * params.limit! - 1)
        
        const { data, error, count } = await query
        
        if (error) throw error
        
        return {
          products: data || [],
          total: count || 0,
          page: params.page || 1,
          limit: params.limit || 12,
          totalPages: Math.ceil((count || 0) / (params.limit || 12)),
        }
      }
      
      let query = supabase
        .from('products')
        .select('*, category:categories(name, slug)', { count: 'exact' })
        .eq('is_active', true)
      
      if (params.slug) {
        query = query.eq('slug', params.slug)
      }
      
      if (params.category) {
        query = query.eq('category_id', params.category)
      }
      
      if (params.tag) {
        query = query.contains('tags', [params.tag])
      }
      
      if (params.search) {
        const searchTerm = `%${params.search}%`
        query = query.or(
          `name.ilike.${searchTerm},sku.ilike.${searchTerm},specifications->>color.ilike.${searchTerm}`
        )
      }
      
      if (params.minPrice) {
        query = query.gte('price', params.minPrice)
      }
      
      if (params.maxPrice) {
        query = query.lte('price', params.maxPrice)
      }
      
      query = query
        .order(params.sortBy || 'created_at', { ascending: params.sortOrder === 'asc' })
        .range((params.page! - 1) * params.limit!, params.page! * params.limit! - 1)
      
      const { data, error, count } = await query
      
      if (error) throw error
      
      return {
        products: data || [],
        total: count || 0,
        page: params.page || 1,
        limit: params.limit || 12,
        totalPages: Math.ceil((count || 0) / (params.limit || 12)),
      }
    },
    
    async getProduct(id: string) {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(name, slug)')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },
    
    async getProductBySlug(slug: string) {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(name, slug)')
        .eq('slug', slug)
        .single()
      
      if (error) throw error
      return data
    },
    
    async createProduct(data: any) {
      const supabase = await createClient()
      const { variations, ...productData } = data
      
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single()
      
      if (productError) throw productError
      
      if (variations && variations.length > 0 && product) {
        const variationsWithProductId = variations.map((v: any) => ({
          ...v,
          product_id: product.id,
        }))
        
        await supabase
          .from('product_variations')
          .insert(variationsWithProductId)
      }
      
      return product
    },
    
    async updateProduct(id: string, data: any) {
      const supabase = await createClient()
      const { variations, ...productData } = data
      
      const { data: product, error: productError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single()
      
      if (productError) throw productError
      
      if (variations) {
        await supabase
          .from('product_variations')
          .delete()
          .eq('product_id', id)
        
        if (variations.length > 0) {
          const variationsWithProductId = variations.map((v: any) => ({
            ...v,
            product_id: id,
          }))
          
          await supabase
            .from('product_variations')
            .insert(variationsWithProductId)
        }
      }
      
      return product
    },
    
    async deleteProduct(id: string) {
      const supabase = await createClient()
      
      await supabase
        .from('product_variations')
        .delete()
        .eq('product_id', id)
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    
    async getProductVariations(productId: string) {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('product_variations')
        .select('*')
        .eq('product_id', productId)
      
      if (error) throw error
      return data || []
    },
    
    async getCategories(params?: CategoryQuery) {
      const supabase = await createClient()
      
      let query = supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (params?.limit) {
        query = query.limit(params.limit)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      
      const categories = data || []
      
      if (!params?.hierarchical) {
        return categories
      }
      
      const categoryMap = new Map()
      const rootCategories: any[] = []
      
      categories.forEach((cat: any) => {
        categoryMap.set(cat.id, { ...cat, children: [] })
      })
      
      categories.forEach((cat: any) => {
        const category = categoryMap.get(cat.id)
        if (cat.parent_id && categoryMap.has(cat.parent_id)) {
          categoryMap.get(cat.parent_id).children.push(category)
        } else {
          rootCategories.push(category)
        }
      })
      
      return rootCategories
    },
    
    async createCategory(data: any) {
      const supabase = await createClient()
      
      const { data: category, error } = await supabase
        .from('categories')
        .insert([data])
        .select()
        .single()
      
      if (error) throw error
      return category
    },
    
    async updateCategory(id: string, data: any) {
      const supabase = await createClient()
      
      const { data: category, error } = await supabase
        .from('categories')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return category
    },
    
    async deleteCategory(id: string) {
      const supabase = await createClient()
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    
    async getOrders(userId?: string) {
      const supabase = await createClient()
      
      let query = supabase
        .from('orders')
        .select('*, items:order_items(product:products(name, images))')
        .order('created_at', { ascending: false })
      
      if (userId) {
        query = query.eq('user_id', userId)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    },
    
    async getOrder(id: string, userId?: string) {
      const supabase = await createClient()
      
      let query = supabase
        .from('orders')
        .select('*, items:order_items(product:products(*))')
        .eq('id', id)
      
      if (userId) {
        query = query.eq('user_id', userId)
      }
      
      const { data, error } = await query.single()
      
      if (error) throw error
      return data
    },
    
    async createOrder(data: OrderInput) {
      const supabase = await createClient()
      
      const total_amount = data.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: data.user_id || null,
            total_amount,
            shipping_address: data.shipping_address,
            billing_address: data.billing_address,
            payment_method: data.payment_method,
            status: data.payment_method === 'cod' ? 'pending' : 'pending',
          },
        ])
        .select()
        .single()
      
      if (orderError) throw orderError
      
      const orderItems = data.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        variation_id: item.variation_id || null,
        quantity: item.quantity,
        price: item.price,
      }))
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
      
      if (itemsError) throw itemsError
      
      if (data.user_id) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', data.user_id)
      }
      
      return order
    },
    
    async updateOrderStatus(id: string, status: string) {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    async getCart(userId: string) {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('user_id', userId)
      
      if (error) throw error
      return data || []
    },
    
    async addToCart(userId: string, productId: string, qty: number, variationId?: string) {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: userId,
          product_id: productId,
          variation_id: variationId || null,
          quantity: qty,
        })
        .select('*, product:products(*)')
        .single()
      
      if (error) throw error
      return data
    },
    
    async updateCart(userId: string, productId: string, qty: number) {
      const supabase = await createClient()
      
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: qty })
        .eq('user_id', userId)
        .eq('product_id', productId)
      
      if (error) throw error
    },
    
    async removeFromCart(userId: string, productId: string) {
      const supabase = await createClient()
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)
      
      if (error) throw error
    },
    
    async clearCart(userId: string) {
      const supabase = await createClient()
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
      
      if (error) throw error
    },
  }
}
