import { WooCommerceClient } from './client'
import { Product, ProductQuery, ProductResponse, ProductVariation } from '@/types'

function mapWooProductToInternal(wooProduct: any): Product {
  const metaData = wooProduct.meta_data || []
  const getMeta = (key: string) => metaData.find((m: any) => m.key === key)?.value || ''
  
  return {
    id: wooProduct.id.toString(),
    name: wooProduct.name,
    slug: wooProduct.slug,
    description: wooProduct.description || '',
    short_description: wooProduct.short_description || '',
    price: parseFloat(wooProduct.price) || 0,
    original_price: wooProduct.regular_price ? parseFloat(wooProduct.regular_price) : null,
    sku: wooProduct.sku || '',
    brand: getMeta('brand'),
    stock: wooProduct.stock_quantity || 0,
    is_active: wooProduct.status === 'publish',
    images: wooProduct.images?.map((img: any) => img.src) || [],
    tags: wooProduct.tags || [],
    category_ids: wooProduct.categories?.map((cat: any) => cat.id.toString()) || [],
    specifications: {
      material: getMeta('material'),
      contents: getMeta('contents'),
      capacity: getMeta('capacity'),
      dimensions: getMeta('dimensions'),
      weight: wooProduct.weight || '',
      color: getMeta('color'),
      package_includes: getMeta('package_includes'),
    },
    safety_features: JSON.parse(getMeta('safety_features') || '[]'),
    features: JSON.parse(getMeta('features') || '[]'),
    product_story: getMeta('product_story'),
    tradition_section: getMeta('tradition_section'),
    made_in_india_section: getMeta('made_in_india_section'),
    handmade_disclaimer: getMeta('handmade_disclaimer'),
    meta_title: getMeta('meta_title'),
    meta_description: getMeta('meta_description'),
    is_comparable: getMeta('is_comparable') === 'true',
    has_variations: wooProduct.type === 'variable',
    created_at: wooProduct.date_created,
  }
}

function mapInternalToWooProduct(data: any): any {
  const metaData = [
    { key: 'brand', value: data.brand || '' },
    { key: 'material', value: data.specifications?.material || '' },
    { key: 'contents', value: data.specifications?.contents || '' },
    { key: 'capacity', value: data.specifications?.capacity || '' },
    { key: 'dimensions', value: data.specifications?.dimensions || '' },
    { key: 'color', value: data.specifications?.color || '' },
    { key: 'package_includes', value: data.specifications?.package_includes || '' },
    { key: 'safety_features', value: JSON.stringify(data.safety_features || []) },
    { key: 'features', value: JSON.stringify(data.features || []) },
    { key: 'product_story', value: data.product_story || '' },
    { key: 'tradition_section', value: data.tradition_section || '' },
    { key: 'made_in_india_section', value: data.made_in_india_section || '' },
    { key: 'handmade_disclaimer', value: data.handmade_disclaimer || '' },
    { key: 'meta_title', value: data.meta_title || '' },
    { key: 'meta_description', value: data.meta_description || '' },
    { key: 'is_comparable', value: data.is_comparable ? 'true' : 'false' },
  ].filter((m) => m.value && m.value !== '[]' && m.value !== '{}')
  
  const wooProduct: any = {
    name: data.name,
    slug: data.slug,
    description: data.description,
    short_description: data.short_description,
    regular_price: data.original_price?.toString(),
    sale_price: data.price?.toString(),
    sku: data.sku,
    stock_quantity: data.stock,
    status: data.is_active ? 'publish' : 'draft',
    categories: data.category_ids?.map((id: string) => ({ id: parseInt(id) })),
    tags: data.tags,
    images: data.images?.map((url: string) => ({ src: url })),
    weight: data.specifications?.weight,
    meta_data: metaData,
  }
  
  if (data.has_variations || (data.variations && data.variations.length > 0)) {
    wooProduct.type = 'variable'
  }
  
  return wooProduct
}

export function createWooCommerceProducts(client: WooCommerceClient) {
  return {
    async getProducts(params: ProductQuery): Promise<ProductResponse> {
      const wooParams: any = {
        per_page: params.limit || 12,
        page: params.page || 1,
        orderby: params.sortBy === 'created_at' ? 'date' : params.sortBy || 'date',
        order: params.sortOrder || 'desc',
        status: 'publish',
      }
      
      if (params.search) wooParams.search = params.search
      if (params.minPrice) wooParams.min_price = params.minPrice.toString()
      if (params.maxPrice) wooParams.max_price = params.maxPrice.toString()
      if (params.category) wooParams.category = params.category
      if (params.slug) wooParams.slug = params.slug
      
      const products = await client.get('products', wooParams)
      
      return {
        products: products.map(mapWooProductToInternal),
        total: products.length,
        page: params.page || 1,
        limit: params.limit || 12,
        totalPages: Math.ceil(products.length / (params.limit || 12)),
      }
    },
    
    async getProduct(id: string): Promise<Product> {
      const product = await client.get(`products/${id}`)
      return mapWooProductToInternal(product)
    },
    
    async getProductBySlug(slug: string): Promise<Product> {
      const products = await client.get('products', { slug, per_page: 1 })
      if (!products || products.length === 0) {
        throw new Error('Product not found')
      }
      return mapWooProductToInternal(products[0])
    },
    
    async createProduct(data: any): Promise<Product> {
      const wooProduct = mapInternalToWooProduct(data)
      const created = await client.post('products', wooProduct)
      
      if (data.variations && data.variations.length > 0 && created.id) {
        for (const variation of data.variations) {
          await client.post(`products/${created.id}/variations`, {
            regular_price: variation.price?.toString(),
            sku: variation.sku,
            stock_quantity: variation.stock,
            attributes: variation.color_name ? [
              { name: 'Color', option: variation.color_name }
            ] : [],
          })
        }
      }
      
      return mapWooProductToInternal(created)
    },
    
    async updateProduct(id: string, data: any): Promise<Product> {
      const wooProduct = mapInternalToWooProduct(data)
      const updated = await client.put(`products/${id}`, wooProduct)
      
      if (data.variations) {
        await client.delete(`products/${id}/variations`, { force: true })
        
        for (const variation of data.variations) {
          await client.post(`products/${id}/variations`, {
            regular_price: variation.price?.toString(),
            sku: variation.sku,
            stock_quantity: variation.stock,
            attributes: variation.color_name ? [
              { name: 'Color', option: variation.color_name }
            ] : [],
          })
        }
      }
      
      return mapWooProductToInternal(updated)
    },
    
    async deleteProduct(id: string): Promise<void> {
      await client.delete(`products/${id}`, { force: true })
    },
    
    async getProductVariations(productId: string): Promise<ProductVariation[]> {
      const variations = await client.get(`products/${productId}/variations`)
      
      return variations.map((v: any) => ({
        id: v.id.toString(),
        product_id: productId,
        sku: v.sku || '',
        color_name: v.attributes?.find((a: any) => a.name === 'Color')?.option || '',
        color_hex: '#000000',
        price: parseFloat(v.price) || 0,
        stock: v.stock_quantity || 0,
        image_url: v.image?.src || '',
        is_active: true,
        created_at: v.date_created,
      }))
    },
  }
}
