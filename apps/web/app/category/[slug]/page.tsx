'use client'

import { useState, useEffect } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChatButton } from "@/components/chat-button"
import { ProductGrid } from "@/components/product-grid"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Loader2 } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  parent_id: string | null
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  original_price: number | null
  images: string[]
  tags: string[]
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [parentCategory, setParentCategory] = useState<Category | null>(null)

  useEffect(() => {
    fetchData()
  }, [params.slug])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch all categories
      const categoriesRes = await fetch('/api/categories')
      const categoriesData = await categoriesRes.json()
      setAllCategories(categoriesData || [])
      
      // Find current category
      const currentCategory = categoriesData?.find((cat: Category) => cat.slug === params.slug)
      
      if (!currentCategory) {
        notFound()
      }
      
      setCategory(currentCategory)
      
      // Find parent category
      if (currentCategory.parent_id) {
        const parent = categoriesData?.find((cat: Category) => cat.id === currentCategory.parent_id)
        setParentCategory(parent || null)
      }
      
      // Fetch products for this category
      const productsRes = await fetch(`/api/products?category=${params.slug}&limit=50`)
      const productsData = await productsRes.json()
      setProducts(productsData.products || [])
      
    } catch (error) {
      console.error('Failed to fetch category data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex justify-center items-center py-40">
          <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
        </div>
        <Footer />
        <ChatButton />
      </main>
    )
  }

  if (!category) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-warm-beige/30 border-b border-border/30">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-terracotta transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            {parentCategory && (
              <>
                <Link 
                  href={`/products?category=${parentCategory.slug}`} 
                  className="text-muted-foreground hover:text-terracotta transition-colors"
                >
                  {parentCategory.name}
                </Link>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </>
            )}
            <span className="text-ink font-medium">{category.name}</span>
          </nav>
        </div>
      </div>
      
      {/* Category Hero */}
      {category.image && (
        <section className="relative h-[40vh] min-h-[300px] max-h-[500px] overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/20 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 w-full pb-12">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream font-light tracking-tight">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-cream/80 text-lg mt-4 font-light max-w-2xl">
                  {category.description}
                </p>
              )}
              <p className="text-cream/60 text-sm mt-4">
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
            </div>
          </div>
        </section>
      )}
      
      {/* Products Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          {!category.image && (
            <div className="mb-12">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-terracotta transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-ink tracking-tight">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-muted-foreground text-lg mt-4 font-light max-w-2xl">
                  {category.description}
                </p>
              )}
              <p className="text-muted-foreground text-sm mt-4">
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
            </div>
          )}
          
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground font-light">
                No products found in this category yet.
              </p>
              <Link 
                href="/products" 
                className="inline-block mt-6 text-terracotta hover:text-terracotta/80 transition-colors underline"
              >
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
      <ChatButton />
    </main>
  )
}
