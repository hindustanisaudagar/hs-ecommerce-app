'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Heart, Loader2 } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  original_price: number | null
  images: string[]
  tags: string[]
}

export function Bestsellers() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      // First try to fetch products with "bestseller" tag
      const res = await fetch('/api/products?tag=bestseller&limit=8')
      const data = await res.json()
      
      // If no bestsellers found, fallback to latest products
      if (data.products && data.products.length > 0) {
        setProducts(data.products)
      } else {
        const fallbackRes = await fetch('/api/products?limit=8&sortBy=created_at&sortOrder=desc')
        const fallbackData = await fallbackRes.json()
        setProducts(fallbackData.products || [])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-warm-beige/40">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section id="shop" className="py-20 md:py-32 bg-warm-beige/40 grain-texture">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-terracotta mb-4 font-medium">
                Most Loved
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-ink tracking-tight">
                Bestsellers
              </h2>
            </div>
            <Link 
              href="/products" 
              className="text-sm font-light text-ink link-underline tracking-wide flex items-center gap-2 group"
            >
              View all products
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 100}>
              <Link href={`/products/${product.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden rounded-2xl md:rounded-3xl bg-cream mb-5 shadow-premium transition-all duration-500 group-hover:shadow-premium-lg">
                  <Image
                    src={product.images?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {product.tags?.[0] && (
                    <Badge 
                      className="absolute top-4 left-4 bg-terracotta text-cream text-[9px] font-light tracking-widest uppercase rounded-full px-4 py-1.5 shadow-sm"
                    >
                      {product.tags[0]}
                    </Badge>
                  )}
                  <button 
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-cream/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cream shadow-sm"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-4 h-4 text-ink" strokeWidth={1.5} />
                  </button>
                  <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <button className="w-full bg-ink/90 backdrop-blur-sm text-cream py-3 rounded-xl text-[11px] uppercase tracking-widest font-light hover:bg-ink transition-colors">
                      Quick Add
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
      </div>
    </section>
  )
}
