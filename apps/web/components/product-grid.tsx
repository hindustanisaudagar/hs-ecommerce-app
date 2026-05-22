'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/types'
import { QuickViewModal } from '@/components/quick-view-modal'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [quickViewProduct, setQuickViewProduct] = useState<string | null>(null)

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlist(prev => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })
  }

  const handleQuickView = (productSlug: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuickViewProduct(productSlug)
  }

  if (products.length === 0) {
    return null
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
        {products.map((product, index) => (
          <Reveal key={product.id} delay={index * 80}>
            <Link href={`/products/${product.slug}`} className="group block">
              <div className="relative aspect-square overflow-hidden rounded-2xl md:rounded-3xl bg-cream mb-5 shadow-premium transition-all duration-500 group-hover:shadow-premium-lg">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
                
                {product.tags?.[0] && (
                  <Badge 
                    className="absolute top-4 left-4 bg-terracotta text-cream text-[9px] font-light tracking-widest uppercase rounded-full px-4 py-1.5 shadow-sm"
                  >
                    {product.tags[0]}
                  </Badge>
                )}
                
                {product.original_price && product.original_price > product.price && (
                  <Badge 
                    className="absolute top-4 left-4 bg-terracotta text-cream text-[9px] font-light tracking-widest uppercase rounded-full px-4 py-1.5 shadow-sm"
                  >
                    Sale
                  </Badge>
                )}
                
                <button 
                  onClick={(e) => toggleWishlist(product.id, e)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-cream/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cream shadow-sm"
                  aria-label="Add to wishlist"
                >
                  <Heart 
                    className={`w-4 h-4 ${wishlist.has(product.id) ? 'fill-terracotta text-terracotta' : 'text-ink'}`} 
                    strokeWidth={1.5} 
                  />
                </button>
                
                <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <button 
                    onClick={(e) => handleQuickView(product.slug, e)}
                    className="w-full bg-ink/90 backdrop-blur-sm text-cream py-3 rounded-xl text-[11px] uppercase tracking-widest font-light hover:bg-ink transition-colors"
                  >
                    Quick View
                  </button>
                </div>
              </div>
              <div className="px-1">
                <h3 className="font-serif text-lg text-ink group-hover:text-terracotta transition-colors duration-300">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-base font-light text-ink">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                  {product.original_price && product.original_price > product.price && (
                    <p className="text-sm text-muted-foreground line-through">
                      ₹{product.original_price.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          productId={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  )
}
