'use client'

import { useState, useEffect, useRef } from 'react'
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Heart, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
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
  const [content, setContent] = useState<any>({
    title: 'Bestsellers',
    subtitle: 'Most Loved',
    view_all_link: '/products',
    view_all_text: 'View all products',
  })
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    checkScrollButtons()
    const scrollContainer = scrollRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollButtons)
      window.addEventListener('resize', checkScrollButtons)
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollButtons)
        window.removeEventListener('resize', checkScrollButtons)
      }
    }
  }, [products])

  const checkScrollButtons = () => {
    const container = scrollRef.current
    if (!container) return
    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10)
  }

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (!container) return
    const scrollAmount = container.clientWidth * 0.8
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const res = await fetch('/api/products?tag=bestseller&limit=12')
      const data = await res.json()
      
      if (data.products && data.products.length > 0) {
        setProducts(data.products)
      } else {
        const fallbackRes = await fetch('/api/products?limit=12&sortBy=created_at&sortOrder=desc')
        const fallbackData = await fallbackRes.json()
        setProducts(fallbackData.products || [])
      }
      
      const contentRes = await fetch('/api/admin/landing-page?section=bestsellers')
      if (contentRes.ok) {
        const contentData = await contentRes.json()
        if (contentData.content) setContent((prev: any) => ({ ...prev, ...contentData.content }))
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
                {content.subtitle}
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-ink tracking-tight">
                {content.title}
              </h2>
            </div>
            <Link 
              href={content.view_all_link} 
              className="text-sm font-light text-ink link-underline tracking-wide flex items-center gap-2 group"
            >
              {content.view_all_text}
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
            </Link>
          </div>
        </Reveal>

        {/* Carousel Container */}
        <div className="relative">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-cream shadow-lg flex items-center justify-center hover:bg-warm-beige transition-all duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-ink" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-cream shadow-lg flex items-center justify-center hover:bg-warm-beige transition-all duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-ink" />
            </button>
          )}

          {/* Scrollable Products */}
          <div
            ref={scrollRef}
            className="flex gap-5 md:gap-8 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <div key={product.id} className="flex-shrink-0 w-[calc(50%-10px)] sm:w-[calc(33.333%-14px)] md:w-[calc(25%-18px)] lg:w-[280px] snap-start">
                <Reveal delay={index * 80}>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
