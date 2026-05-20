'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Heart, Minus, Plus, ShoppingBag, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/store/use-cart'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  original_price: number | null
  images: string[]
  description: string | null
  tags: string[]
  specifications?: {
    color?: string
    material?: string
    dimensions?: string
  }
}

interface QuickViewModalProps {
  productId: string
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ productId, isOpen, onClose }: QuickViewModalProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const addToCart = useCart((state) => state.addItem)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isOpen && productId) {
      fetchProduct()
    }
  }, [isOpen, productId])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products?slug=${productId}`)
      const data = await res.json()
      setProduct(data.products?.[0] || null)
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    if (product) {
      addToCart(product.id, quantity)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-cream rounded-3xl shadow-premium-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-cream/80 backdrop-blur-sm flex items-center justify-center hover:bg-cream transition-colors shadow-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-ink" strokeWidth={1.5} />
        </button>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
          </div>
        ) : product ? (
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-warm-beige">
                <Image
                  src={product.images?.[selectedImage] || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.tags?.[0] && (
                  <Badge 
                    className="absolute top-4 left-4 bg-terracotta text-cream text-[9px] font-light tracking-widest uppercase rounded-full px-4 py-1.5 shadow-sm"
                  >
                    {product.tags[0]}
                  </Badge>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-terracotta' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl text-ink font-light tracking-tight">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3 mt-3">
                  <p className="text-2xl font-light text-terracotta">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                  {product.original_price && product.original_price > product.price && (
                    <p className="text-lg text-muted-foreground line-through">
                      ₹{product.original_price.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </div>

              {product.description && (
                <p className="text-muted-foreground font-light leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Specifications */}
              {product.specifications && (
                <div className="space-y-2">
                  {product.specifications.color && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Color:</span>{' '}
                      <span className="text-ink">{product.specifications.color}</span>
                    </p>
                  )}
                  {product.specifications.material && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Material:</span>{' '}
                      <span className="text-ink">{product.specifications.material}</span>
                    </p>
                  )}
                  {product.specifications.dimensions && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Dimensions:</span>{' '}
                      <span className="text-ink">{product.specifications.dimensions}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Quantity:</span>
                <div className="flex items-center border border-border/50 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-warm-beige transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-warm-beige transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-ink text-cream hover:bg-ink/90 rounded-full py-6 text-sm font-light tracking-widest uppercase group btn-shine shadow-premium transition-all duration-300"
                >
                  <ShoppingBag className="mr-2 w-4 h-4" strokeWidth={1.5} />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-6 py-6 border-border/50 hover:bg-warm-beige transition-colors"
                  aria-label="Add to wishlist"
                >
                  <Heart className="w-5 h-5" strokeWidth={1.5} />
                </Button>
              </div>

              {/* View Full Details */}
              <div className="pt-4 border-t border-border/30">
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="text-sm text-terracotta hover:text-terracotta/80 transition-colors underline"
                >
                  View full product details →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Product not found</p>
          </div>
        )}
      </div>
    </div>
  )
}
