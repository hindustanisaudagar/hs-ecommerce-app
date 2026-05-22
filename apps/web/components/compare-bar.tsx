'use client'

import { useCompare } from '@/hooks/store/use-compare'
import { X, GitCompare } from 'lucide-react'
import Link from 'next/link'

export function CompareBar() {
  const { items, removeItem, clearAll } = useCompare()

  if (items.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-ink text-cream shadow-premium-lg z-50">
      <div className="max-w-[1440px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GitCompare className="w-5 h-5" />
            <span className="text-sm font-medium">
              Compare ({items.length}/4)
            </span>
            <div className="flex gap-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 bg-cream/10 px-3 py-1.5 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span className="text-xs truncate max-w-[120px]">
                    {item.name}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-cream/70 hover:text-cream"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={clearAll}
              className="text-xs text-cream/70 hover:text-cream"
            >
              Clear All
            </button>
            <Link
              href="/compare"
              className="bg-terracotta text-cream px-6 py-2 rounded-lg text-sm font-medium hover:bg-terracotta/90 transition-colors"
            >
              Compare Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
