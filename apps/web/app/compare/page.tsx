'use client'

import { useCompare } from '@/hooks/store/use-compare'
import { ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ComparePage() {
  const router = useRouter()
  const { items, removeItem, clearAll } = useCompare()

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-warm-beige/40">
        <div className="max-w-[1440px] mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="font-serif text-3xl text-ink mb-4">Compare Products</h1>
            <p className="text-muted-foreground mb-8">No products to compare</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-ink text-cream px-6 py-3 rounded-xl hover:bg-ink/90"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const comparisonFields = [
    { label: 'Image', key: 'image' },
    { label: 'Name', key: 'name' },
    { label: 'SKU', key: 'sku' },
    { label: 'Price', key: 'price' },
    { label: 'Original Price', key: 'original_price' },
    { label: 'Discount', key: 'discount' },
    { label: 'Stock', key: 'stock' },
    { label: 'Brand', key: 'brand' },
    { label: 'Material', key: 'specifications.material' },
    { label: 'Capacity', key: 'specifications.capacity' },
    { label: 'Dimensions', key: 'specifications.dimensions' },
    { label: 'Weight', key: 'specifications.weight' },
    { label: 'Safety Features', key: 'safety_features' },
  ]

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  return (
    <main className="min-h-screen bg-warm-beige/40 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-warm-beige rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-3xl text-ink">Compare Products</h1>
          </div>
          <button
            onClick={clearAll}
            className="text-sm text-terracotta hover:underline"
          >
            Clear All
          </button>
        </div>

        <div className="bg-cream rounded-2xl overflow-hidden shadow-premium">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left px-6 py-4 bg-warm-beige/50 text-sm font-medium text-muted-foreground w-48 sticky left-0 bg-warm-beige/50 z-10">
                    Features
                  </th>
                  {items.map((item) => (
                    <th key={item.id} className="px-6 py-4 min-w-[250px]">
                      <div className="relative">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <p className="font-medium text-ink text-sm">{item.name}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {comparisonFields.map((field) => (
                  <tr key={field.key}>
                    <td className="px-6 py-4 bg-warm-beige/30 text-sm font-medium text-ink sticky left-0 bg-warm-beige/30 z-10">
                      {field.label}
                    </td>
                    {items.map((item) => {
                      const value = getNestedValue(item, field.key)
                      let displayValue = value

                      if (field.key === 'price') {
                        displayValue = value ? `₹${value.toLocaleString('en-IN')}` : '-'
                      } else if (field.key === 'original_price') {
                        displayValue = value ? `₹${value.toLocaleString('en-IN')}` : '-'
                      } else if (field.key === 'discount') {
                        if (item.price && item.original_price) {
                          const discount = Math.round(
                            ((item.original_price - item.price) / item.original_price) * 100
                          )
                          displayValue = `${discount}% OFF`
                        } else {
                          displayValue = '-'
                        }
                      } else if (field.key === 'stock') {
                        displayValue = value ? `${value} in stock` : '-'
                      } else if (field.key === 'safety_features') {
                        displayValue = value && value.length > 0
                          ? value.join(', ')
                          : '-'
                      } else if (!value) {
                        displayValue = '-'
                      }

                      return (
                        <td key={item.id} className="px-6 py-4 text-sm text-ink/80">
                          {displayValue}
                        </td>
                      )
                    })}
                  </tr>
                ))}
                <tr>
                  <td className="px-6 py-4 bg-warm-beige/30 sticky left-0 bg-warm-beige/30 z-10"></td>
                  {items.map((item) => (
                    <td key={item.id} className="px-6 py-4">
                      <Link
                        href={`/products/${item.slug}`}
                        className="block w-full text-center bg-ink text-cream py-3 rounded-xl text-sm hover:bg-ink/90 transition-colors"
                      >
                        View Product
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
