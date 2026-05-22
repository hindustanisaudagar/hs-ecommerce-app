import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CompareItem {
  id: string
  name: string
  slug: string
  image: string
  price: number
  original_price: number | null
  sku: string
  stock: number
  brand?: string
  specifications?: any
  safety_features?: string[]
  has_variations?: boolean
}

interface CompareStore {
  items: CompareItem[]
  addItem: (item: CompareItem) => void
  removeItem: (id: string) => void
  clearAll: () => void
  isInCompare: (id: string) => boolean
  maxItems: number
}

const createStorage = () => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default
    return createJSONStorage(() => AsyncStorage)
  } catch {
    if (typeof window !== 'undefined') {
      return createJSONStorage(() => localStorage)
    }
    return undefined
  }
}

export const useCompare = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      maxItems: 4,

      addItem: (item) => {
        const { items, maxItems } = get()
        if (items.length >= maxItems) return
        if (items.find((i) => i.id === item.id)) return
        set({ items: [...items, item] })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      clearAll: () => set({ items: [] }),

      isInCompare: (id) => {
        return get().items.some((item) => item.id === id)
      },
    }),
    {
      name: 'compare-storage',
      storage: createStorage(),
    }
  )
)
