import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface WishlistItem {
  productId: string
  addedAt: string
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  toggleItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
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

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        set((state) => {
          if (state.items.find((item) => item.productId === productId)) {
            return state
          }
          return {
            items: [...state.items, { productId, addedAt: new Date().toISOString() }],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))
      },

      toggleItem: (productId) => {
        const { isInWishlist } = get()
        if (isInWishlist(productId)) {
          get().removeItem(productId)
        } else {
          get().addItem(productId)
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId)
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
      storage: createStorage(),
    }
  )
)
