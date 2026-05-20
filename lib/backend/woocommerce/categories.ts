import { WooCommerceClient } from './client'
import { Category, CategoryQuery } from '@/types'

function mapWooCategoryToInternal(wooCategory: any): Category {
  return {
    id: wooCategory.id.toString(),
    name: wooCategory.name,
    slug: wooCategory.slug,
    description: wooCategory.description || '',
    image: wooCategory.image?.src || '',
    parent_id: wooCategory.parent ? wooCategory.parent.toString() : null,
  }
}

export function createWooCommerceCategories(client: WooCommerceClient) {
  return {
    async getCategories(params?: CategoryQuery): Promise<Category[]> {
      const categories = await client.get('products/categories', {
        per_page: 100,
        orderby: 'name',
        order: 'asc',
      })
      
      const mapped = categories.map(mapWooCategoryToInternal)
      
      if (!params?.hierarchical) return mapped
      
      const categoryMap = new Map()
      const rootCategories: any[] = []
      
      mapped.forEach((cat) => {
        categoryMap.set(cat.id, { ...cat, children: [] })
      })
      
      mapped.forEach((cat) => {
        const category = categoryMap.get(cat.id)
        if (cat.parent_id && categoryMap.has(cat.parent_id)) {
          categoryMap.get(cat.parent_id).children.push(category)
        } else {
          rootCategories.push(category)
        }
      })
      
      return rootCategories
    },
    
    async createCategory(data: any): Promise<Category> {
      const wooCategory = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parent: data.parent_id ? parseInt(data.parent_id) : 0,
        image: data.image ? { src: data.image } : undefined,
      }
      
      const created = await client.post('products/categories', wooCategory)
      return mapWooCategoryToInternal(created)
    },
    
    async updateCategory(id: string, data: any): Promise<Category> {
      const wooCategory = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parent: data.parent_id ? parseInt(data.parent_id) : 0,
        image: data.image ? { src: data.image } : undefined,
      }
      
      const updated = await client.put(`products/categories/${id}`, wooCategory)
      return mapWooCategoryToInternal(updated)
    },
    
    async deleteCategory(id: string): Promise<void> {
      await client.delete(`products/categories/${id}`)
    },
  }
}
