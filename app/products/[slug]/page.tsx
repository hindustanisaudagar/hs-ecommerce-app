'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag, Star, Share2, GitCompare, Facebook, Twitter, Linkedin, Mail, ExternalLink } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Reveal } from '@/components/reveal'
import { useCart } from '@/hooks/store/use-cart'
import { useWishlist } from '@/hooks/store/use-wishlist'
import { useCompare } from '@/hooks/store/use-compare'
import { Product, ProductVariation } from '@/types'

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [variations, setVariations] = useState<ProductVariation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null)
  const addItem = useCart((state) => state.addItem)
  const { toggleItem, isInWishlist } = useWishlist()
  const { addItem: addCompareItem, isInCompare } = useCompare()
  const isWishlisted = product ? isInWishlist(product.id) : false
  const isCompared = product ? isInCompare(product.id) : false

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products?slug=${slug}`)
      const data = await res.json()
      const foundProduct = data.products?.[0] || null
      setProduct(foundProduct)

      if (foundProduct?.has_variations && foundProduct.id) {
        const varRes = await fetch(`/api/products/${foundProduct.id}/variations`)
        const varData = await varRes.json()
        setVariations(varData.variations || [])
      }
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
      alert(`${quantity} item(s) added to cart!`)
    }
  }

  const handleShare = (platform: string) => {
    if (!product) return
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(product.name)
    
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`,
      email: `mailto:?subject=${text}&body=${url}`,
    }
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400')
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied!')
  }

  const getDiscount = () => {
    if (!product?.original_price || !product?.price) return 0
    return Math.round(((product.original_price - product.price) / product.original_price) * 100)
  }

  const displayPrice = selectedVariation?.price || product?.price || 0
  const displayStock = selectedVariation?.stock ?? product?.stock ?? 0
  const displaySku = selectedVariation?.sku || product?.sku || product?.id?.slice(0, 8) || ''

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

  const discount = getDiscount()

  return (
    <main className="min-h-screen pb-24">
      <Header />

      {/* Product Hero Section */}
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
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-cream">
                {product.images?.[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-terracotta text-cream px-3 py-1.5 rounded-lg text-sm font-medium">
                    -{discount}%
                  </div>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square overflow-hidden rounded-xl bg-cream transition-all ${
                        selectedImage === index ? 'ring-2 ring-terracotta' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <Reveal>
                <div>
                  {product.brand && (
                    <p className="text-sm text-terracotta font-medium uppercase tracking-wide">
                      {product.brand}
                    </p>
                  )}
                  <h1 className="font-serif text-3xl md:text-4xl font-light text-ink mt-2 leading-tight">
                    {product.name}
                  </h1>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="flex items-center gap-4 flex-wrap">
                  <p className="text-3xl font-light text-ink">
                    ₹{displayPrice.toLocaleString('en-IN')}
                  </p>
                  {product.original_price && product.original_price > displayPrice && (
                    <>
                      <p className="text-xl text-muted-foreground line-through">
                        ₹{product.original_price.toLocaleString('en-IN')}
                      </p>
                      <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        SAVED {discount}%
                      </span>
                    </>
                  )}
                </div>
              </Reveal>

              {/* About the items */}
              {product.short_description && (
                <Reveal delay={200}>
                  <div className="bg-cream rounded-2xl p-6">
                    <h2 className="font-serif text-xl text-ink mb-4">About the items</h2>
                    <div 
                      className="prose prose-sm max-w-none text-ink/80"
                      dangerouslySetInnerHTML={{ __html: product.short_description }}
                    />
                  </div>
                </Reveal>
              )}

              {/* Color Variations */}
              {variations.length > 0 && (
                <Reveal delay={250}>
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Color: <span className="text-ink font-medium">{selectedVariation?.color_name || 'Select'}</span></p>
                    <div className="flex flex-wrap gap-3">
                      {variations.map((variation) => (
                        <button
                          key={variation.id}
                          onClick={() => setSelectedVariation(variation)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                            selectedVariation?.id === variation.id
                              ? 'ring-2 ring-terracotta border-terracotta bg-terracotta/5'
                              : 'border-border/50 hover:border-terracotta/50'
                          }`}
                        >
                          <span
                            className="w-6 h-6 rounded-full border border-border/50"
                            style={{ backgroundColor: variation.color_hex || '#000' }}
                          />
                          <span className="text-sm text-ink">{variation.color_name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Quantity */}
              <Reveal delay={300}>
                <div className="flex items-center gap-4">
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

              {/* Add to Cart & Actions */}
              <Reveal delay={400}>
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={displayStock === 0}
                    className="flex-1 bg-ink text-cream py-4 rounded-xl text-sm uppercase tracking-widest font-light hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {displayStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => product && toggleItem(product.id)}
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

              {/* Share & Compare */}
              <Reveal delay={450}>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Share:</span>
                    <button onClick={() => handleShare('facebook')} className="p-2 hover:bg-warm-beige rounded-lg transition-colors">
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleShare('twitter')} className="p-2 hover:bg-warm-beige rounded-lg transition-colors">
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleShare('linkedin')} className="p-2 hover:bg-warm-beige rounded-lg transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleShare('email')} className="p-2 hover:bg-warm-beige rounded-lg transition-colors">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => product && addCompareItem({
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      image: product.images?.[0] || '',
                      price: displayPrice,
                      original_price: product.original_price,
                      sku: displaySku,
                      stock: displayStock,
                      brand: product.brand,
                      specifications: product.specifications,
                      safety_features: product.safety_features,
                      has_variations: product.has_variations,
                    })}
                    disabled={isCompared}
                    className={`flex items-center gap-2 px-4 py-2 border border-border/50 rounded-xl text-sm transition-colors ${
                      isCompared
                        ? 'bg-terracotta/10 text-terracotta border-terracotta/50'
                        : 'hover:bg-warm-beige'
                    }`}
                  >
                    <GitCompare className="w-4 h-4" />
                    {isCompared ? 'Added' : 'Compare'}
                  </button>
                </div>
              </Reveal>

              {/* SKU & Info */}
              <Reveal delay={500}>
                <div className="pt-6 border-t border-border/50 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-medium text-ink">SKU:</span>
                    {displaySku}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-medium text-ink">Availability:</span>
                    <span className={displayStock > 0 ? 'text-green-600' : 'text-red-600'}>
                      {displayStock > 0 ? `${displayStock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  {product.safety_features && product.safety_features.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-2">
                      <span className="font-medium text-ink text-sm">Features:</span>
                      {product.safety_features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-warm-beige rounded-full text-xs text-ink"
                        >
                          {feature}
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

      {/* Product Description Section */}
      {product.description && (
        <section className="py-16 bg-cream">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <Reveal>
              <div 
                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-ink prose-p:text-ink/80 prose-a:text-terracotta"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* Product Story */}
      {product.product_story && (
        <section className="py-16 bg-warm-beige/40">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <Reveal>
              <div 
                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-ink prose-p:text-ink/80"
                dangerouslySetInnerHTML={{ __html: product.product_story }}
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* Features Grid */}
      {product.features && product.features.length > 0 && (
        <section className="py-16 bg-cream">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <Reveal>
              <h2 className="font-serif text-2xl text-ink text-center mb-12">Product Features</h2>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {product.features.map((feature, index) => (
                <Reveal key={index} delay={index * 100}>
                  <div className="text-center p-6 bg-warm-beige/30 rounded-2xl">
                    {feature.icon_url && (
                      <img
                        src={feature.icon_url}
                        alt={feature.title}
                        className="w-16 h-16 mx-auto mb-4 object-contain"
                        loading="lazy"
                      />
                    )}
                    <h3 className="font-medium text-ink mb-2">{feature.title}</h3>
                    {feature.description && (
                      <div
                        className="text-sm text-ink/70 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: feature.description }}
                      />
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Made in India Section */}
      {product.made_in_india_section && (
        <section className="py-16 bg-warm-beige/40">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <Reveal>
              <div 
                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-ink prose-p:text-ink/80"
                dangerouslySetInnerHTML={{ __html: product.made_in_india_section }}
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* Banner Image */}
      {product.banner_image && (
        <section className="py-8">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <Reveal>
              <div className="relative aspect-[3/1] overflow-hidden rounded-3xl">
                <Image
                  src={product.banner_image}
                  alt="Banner"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Handmade Disclaimer */}
      {product.handmade_disclaimer && (
        <section className="py-12 bg-cream">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <Reveal>
              <div className="bg-warm-beige/30 rounded-2xl p-8 text-center">
                <p className="text-sm text-ink/70 italic">{product.handmade_disclaimer}</p>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
