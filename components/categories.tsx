'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Loader2 } from "lucide-react"
import { Reveal } from "@/components/reveal"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
}

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [content, setContent] = useState<any>({
    title: 'Shop Your Favorite',
    subtitle: 'Collections',
    view_all_link: '/products',
    view_all_text: 'View all',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch section content first to check for independent categories
      const contentRes = await fetch('/api/admin/landing-page?section=categories')
      if (contentRes.ok) {
        const contentData = await contentRes.json()
        if (contentData.content) {
          setContent((prev: any) => ({ ...prev, ...contentData.content }))
          // If independent items exist, use them instead of DB categories
          if (contentData.content.items && contentData.content.items.length > 0) {
            setCategories(contentData.content.items.map((item: any) => ({
              id: item.name,
              name: item.name,
              slug: item.link || '',
              description: null,
              image: item.image || null,
            })))
            setLoading(false)
            return
          }
        }
      }
      
      // Fallback to database categories
      const catRes = await fetch('/api/categories?hierarchical=true&limit=8')
      const catData = await catRes.json()
      setCategories(catData || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-background grain-texture">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section id="categories" className="py-20 md:py-32 bg-background grain-texture">
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 80}>
              <Link href={category.slug.startsWith('/') ? category.slug : `/products?category=${category.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl shadow-premium transition-all duration-500 group-hover:shadow-premium-lg">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-warm-beige to-cream flex items-center justify-center">
                      <span className="text-4xl font-serif text-muted-foreground/30">{category.name.charAt(0)}</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                    {category.description && (
                      <p className="text-[10px] uppercase tracking-[0.2em] text-cream/70 mb-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        {category.description}
                      </p>
                    )}
                    <h3 className="font-serif text-lg md:text-xl text-cream font-light tracking-wide">
                      {category.name}
                    </h3>
                    <div className="w-0 h-[1px] bg-cream/50 mt-3 group-hover:w-full transition-all duration-700 ease-out" />
                  </div>

                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-cream/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:bg-cream/20">
                    <ArrowUpRight className="w-4 h-4 text-cream" strokeWidth={1.5} />
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
