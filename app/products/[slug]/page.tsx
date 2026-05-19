'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag, Star } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Reveal } from '@/components/reveal'
import { useCart } from '@/hooks/store/use-cart'
import { Product } from '@/types'

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const addItem = useCart((state) => state.addItem)

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products?search=${slug}`)
      const data = await res.json()
      const foundProduct = data.products?.find((p: Product) => p.slug === slug)
      setProduct(foundProduct || null)
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product)
      }
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-20">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="aspect-square bg-cream rounded-3xl" />
              <div className="space-y-6">
                <div className="h-8 bg-cream rounded w-3/4" />
                <div className="h-6 bg-cream rounded w-1/4" />
                <div className="h-24 bg-cream rounded" />
                <div className="h-12 bg-cream rounded" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-20 text-center">
          <h1 className="font-serif text-3xl text-ink mb-4">Product Not Found</h1>
          <Link href="/products" className="text-terracotta hover:underline">
            Back to Products
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-12 md:py-20 bg-warm-beige/40 grain-texture">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ink mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-cream">
                {product.images?.[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square overflow-hidden rounded-xl bg-cream ${
                        selectedImage === index ? 'ring-2 ring-terracotta' : ''
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Reveal>
                <div>
                  {product.category && (
                    <Link
                      href={`/category/${product.category.slug}`}
                      className="text-sm text-terracotta hover:underline"
                    >
                      {product.category.name}
                    </Link>
                  )}
                  <h1 className="font-serif text-3xl md:text-4xl font-light text-ink mt-2">
                    {product.name}
                  </h1>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="flex items-center gap-4">
                  <p className="text-2xl font-light text-ink">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                  {product.original_price && product.original_price > product.price && (
                    <p className="text-lg text-muted-foreground line-through">
                      ₹{product.original_price.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-gold text-gold"
                        strokeWidth={1}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    (0 reviews)
                  </span>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <p className="text-ink/80 leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              </Reveal>

              <Reveal delay={400}>
                <div className="flex items-center gap-4 pt-4">
                  <span className="text-sm text-muted-foreground">Quantity:</span>
                  <div className="flex items-center border border-border/50 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-3 hover:bg-warm-beige transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 text-ink min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-3 hover:bg-warm-beige transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={500}>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-ink text-cream py-4 rounded-xl text-sm uppercase tracking-widest font-light hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-4 border border-border/50 rounded-xl transition-colors ${
                      isWishlisted
                        ? 'bg-terracotta border-terracotta text-cream'
                        : 'hover:bg-warm-beige'
                    }`}
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={isWishlisted ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
              </Reveal>

              <Reveal delay={600}>
                <div className="pt-6 border-t border-border/50 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-medium text-ink">SKU:</span>
                    {product.id.slice(0, 8)}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-medium text-ink">Availability:</span>
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-2">
                      <span className="font-medium text-ink text-sm">Tags:</span>
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-warm-beige rounded-full text-xs text-ink"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
